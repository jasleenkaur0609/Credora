import { generateSecret, generateURI, verify } from "otplib";
import QRCode from "qrcode";

import { prisma } from "../../database/prisma.js";
import { securityConfig } from "../../config/security.js";
import {
  decryptSecret,
  encryptSecret,
} from "../../utils/encryption.js";

export interface MfaSetupResult {
  method: "TOTP";
  secret: string;
  otpauthUrl: string;
  qrCodeDataUrl: string;
}

export interface MfaStatusResult {
  enabled: boolean;
  method: "TOTP" | null;
  verifiedAt: Date | null;
  lastUsedAt: Date | null;
}

export interface MfaChallengeResult {
  challengeId: string;
  expiresAt: Date;
}

export class MfaService {
  async generateSetup(
    userId: string,
    email: string,
  ): Promise<MfaSetupResult> {
    const secret = generateSecret();

    const otpauthUrl = generateURI({
      issuer: securityConfig.mfa.totp.issuer,
      label: email,
      secret,
      algorithm: securityConfig.mfa.totp.algorithm,
      digits: securityConfig.mfa.totp.digits,
      period: securityConfig.mfa.totp.periodSeconds,
    });

    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 320,
    });

    const secretEncrypted = encryptSecret(secret);

    const existingConfiguration =
      await prisma.mfaConfiguration.findFirst({
        where: {
          userId,
        },
      });

    if (existingConfiguration) {
      await prisma.mfaConfiguration.update({
        where: {
          id: existingConfiguration.id,
        },
        data: {
          method: "TOTP",
          secretEncrypted,
          enabled: false,
          verifiedAt: null,
          lastUsedAt: null,
        },
      });
    } else {
      await prisma.mfaConfiguration.create({
        data: {
          userId,
          method: "TOTP",
          secretEncrypted,
          enabled: false,
          verifiedAt: null,
          lastUsedAt: null,
        },
      });
    }

    return {
      method: "TOTP",
      secret,
      otpauthUrl,
      qrCodeDataUrl,
    };
  }

  async verifySetup(
    userId: string,
    token: string,
  ): Promise<boolean> {
    const configuration =
      await prisma.mfaConfiguration.findFirst({
        where: {
          userId,
        },
      });

    if (!configuration) {
      return false;
    }

    const secret = decryptSecret(
      configuration.secretEncrypted,
    );

    const result = await verify({
      secret,
      token,
      algorithm: securityConfig.mfa.totp.algorithm,
      digits: securityConfig.mfa.totp.digits,
      period: securityConfig.mfa.totp.periodSeconds,
    });

    const verified =
      typeof result === "boolean"
        ? result
        : result.valid;

    if (!verified) {
      return false;
    }

    await prisma.mfaConfiguration.update({
      where: {
        id: configuration.id,
      },
      data: {
        enabled: true,
        verifiedAt: new Date(),
        lastUsedAt: new Date(),
      },
    });

    return true;
  }

  async getStatus(
    userId: string,
  ): Promise<MfaStatusResult> {
    const configuration =
      await prisma.mfaConfiguration.findFirst({
        where: {
          userId,
        },
        select: {
          enabled: true,
          method: true,
          verifiedAt: true,
          lastUsedAt: true,
        },
      });

    if (!configuration) {
      return {
        enabled: false,
        method: null,
        verifiedAt: null,
        lastUsedAt: null,
      };
    }

    return {
      enabled: configuration.enabled,
      method: configuration.method,
      verifiedAt: configuration.verifiedAt,
      lastUsedAt: configuration.lastUsedAt,
    };
  }

  async verifyToken(
    userId: string,
    token: string,
  ): Promise<boolean> {
    const configuration =
      await prisma.mfaConfiguration.findFirst({
        where: {
          userId,
        },
      });

    if (
      !configuration ||
      !configuration.enabled ||
      !configuration.verifiedAt
    ) {
      return false;
    }

    const secret = decryptSecret(
      configuration.secretEncrypted,
    );

    const result = await verify({
      secret,
      token,
      algorithm: securityConfig.mfa.totp.algorithm,
      digits: securityConfig.mfa.totp.digits,
      period: securityConfig.mfa.totp.periodSeconds,
    });

    const verified =
      typeof result === "boolean"
        ? result
        : result.valid;

    if (!verified) {
      return false;
    }

    await prisma.mfaConfiguration.update({
      where: {
        id: configuration.id,
      },
      data: {
        lastUsedAt: new Date(),
      },
    });

    return true;
  }

  async createChallenge(
    userId: string,
    purpose: "LOGIN" | "SETUP" = "LOGIN",
  ): Promise<MfaChallengeResult> {
    const now = new Date();

    const expiresAt = new Date(
      now.getTime() +
        securityConfig.mfa.challenge.expirySeconds * 1000,
    );

    await prisma.mfaChallenge.updateMany({
      where: {
        userId,
        purpose,
        status: "ACTIVE",
      },
      data: {
        status: "EXPIRED",
      },
    });

    const challenge =
      await prisma.mfaChallenge.create({
        data: {
          userId,
          purpose,
          status: "ACTIVE",
          expiresAt,
          attempts: 0,
          maxAttempts:
            securityConfig.mfa.challenge.maxAttempts,
        },
      });

    return {
      challengeId: challenge.id,
      expiresAt: challenge.expiresAt,
    };
  }

  async getActiveChallenge(
    challengeId: string,
    purpose: "LOGIN" | "SETUP" = "LOGIN",
  ) {
    const challenge =
      await prisma.mfaChallenge.findFirst({
        where: {
          id: challengeId,
          purpose,
          status: "ACTIVE",
        },
      });

    if (!challenge) {
      return null;
    }

    if (challenge.expiresAt <= new Date()) {
      await prisma.mfaChallenge.update({
        where: {
          id: challenge.id,
        },
        data: {
          status: "EXPIRED",
        },
      });

      return null;
    }

    if (challenge.attempts >= challenge.maxAttempts) {
      await prisma.mfaChallenge.update({
        where: {
          id: challenge.id,
        },
        data: {
          status: "LOCKED",
        },
      });

      return null;
    }

    return challenge;
  }

  async recordFailedAttempt(
    challengeId: string,
  ): Promise<{
    attempts: number;
    locked: boolean;
  }> {
    const challenge =
      await prisma.mfaChallenge.findUnique({
        where: {
          id: challengeId,
        },
      });

    if (!challenge) {
      return {
        attempts: 0,
        locked: true,
      };
    }

    const attempts = challenge.attempts + 1;

    const locked =
      attempts >= challenge.maxAttempts;

    await prisma.mfaChallenge.update({
      where: {
        id: challengeId,
      },
      data: {
        attempts,
        status: locked ? "LOCKED" : "ACTIVE",
      },
    });

    return {
      attempts,
      locked,
    };
  }

  async consumeChallenge(
    challengeId: string,
  ): Promise<void> {
    await prisma.mfaChallenge.update({
      where: {
        id: challengeId,
      },
      data: {
        status: "CONSUMED",
        consumedAt: new Date(),
      },
    });
  }
}

export const mfaService = new MfaService();
