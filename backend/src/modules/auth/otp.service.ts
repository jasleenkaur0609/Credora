import { createHash, randomInt } from "node:crypto";
import { prisma } from "../../database/prisma.js";
import { securityConfig } from "../../config/security.js";

export class OtpService {
  private readonly otpLength = securityConfig.otp.length;
  private readonly expiryMinutes = securityConfig.otp.expiryMinutes;
  private readonly maxAttempts = securityConfig.otp.maxAttempts;
  private readonly resendCooldownSeconds =
    securityConfig.otp.resendCooldownSeconds;

  /**
   * Generate a cryptographically secure numeric OTP.
   */
  private generateCode(): string {
    const minimum = 10 ** (this.otpLength - 1);
    const maximum = 10 ** this.otpLength;

    return randomInt(minimum, maximum).toString();
  }

  /**
   * Hash the OTP before storing it.
   *
   * The raw OTP must never be persisted in the database.
   */
  private hashCode(code: string): string {
    return createHash("sha256").update(code).digest("hex");
  }

  /**
   * Generate and persist a new OTP.
   *
   * Any previous unused OTP for the same user and purpose
   * is invalidated before the new OTP is created.
   */
  async generate(
    userId: string,
    purpose:
      | "EMAIL_VERIFICATION"
      | "PASSWORD_RESET"
      | "LOGIN_VERIFICATION",
  ): Promise<{
    code: string;
    expiresAt: Date;
  }> {
    const now = new Date();

    const latestOtp = await prisma.otpRecord.findFirst({
      where: {
        userId,
        purpose,
        usedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (latestOtp) {
      const elapsedSeconds =
        (now.getTime() - latestOtp.createdAt.getTime()) / 1000;

      if (elapsedSeconds < this.resendCooldownSeconds) {
        const remainingSeconds = Math.ceil(
          this.resendCooldownSeconds - elapsedSeconds,
        );

        throw new Error(
          `Please wait ${remainingSeconds} seconds before requesting another OTP.`,
        );
      }
    }

    await prisma.otpRecord.updateMany({
      where: {
        userId,
        purpose,
        usedAt: null,
      },
      data: {
        usedAt: now,
      },
    });

    const code = this.generateCode();
    const codeHash = this.hashCode(code);

    const expiresAt = new Date(
      now.getTime() + this.expiryMinutes * 60 * 1000,
    );

    await prisma.otpRecord.create({
      data: {
        userId,
        purpose,
        codeHash,
        expiresAt,
        attempts: 0,
        maxAttempts: this.maxAttempts,
      },
    });

    return {
      code,
      expiresAt,
    };
  }

  /**
   * Verify an OTP.
   *
   * OTPs are:
   * - single-use
   * - time-limited
   * - attempt-limited
   */
  async verify(
    userId: string,
    purpose:
      | "EMAIL_VERIFICATION"
      | "PASSWORD_RESET"
      | "LOGIN_VERIFICATION",
    code: string,
  ): Promise<boolean> {
    const otp = await prisma.otpRecord.findFirst({
      where: {
        userId,
        purpose,
        usedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otp) {
      return false;
    }

    const now = new Date();

    if (now >= otp.expiresAt) {
      await prisma.otpRecord.update({
        where: {
          id: otp.id,
        },
        data: {
          usedAt: now,
        },
      });

      return false;
    }

    if (otp.attempts >= otp.maxAttempts) {
      await prisma.otpRecord.update({
        where: {
          id: otp.id,
        },
        data: {
          usedAt: now,
        },
      });

      return false;
    }

    const submittedHash = this.hashCode(code);

    if (submittedHash !== otp.codeHash) {
      const newAttempts = otp.attempts + 1;

      await prisma.otpRecord.update({
        where: {
          id: otp.id,
        },
        data: {
          attempts: newAttempts,
          ...(newAttempts >= otp.maxAttempts
            ? { usedAt: now }
            : {}),
        },
      });

      return false;
    }

    await prisma.otpRecord.update({
      where: {
        id: otp.id,
      },
      data: {
        usedAt: now,
      },
    });

    return true;
  }
}

export const otpService = new OtpService();