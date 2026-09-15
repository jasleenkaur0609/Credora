import { randomBytes } from "node:crypto";
import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../database/prisma.js";
import { env } from "../../config/env.js";
import { securityConfig } from "../../config/security.js";
import { emailService } from "./email.service.js";
import { jwtService } from "./jwt.service.js";
import { otpService } from "./otp.service.js";
import { passwordService } from "./password.service.js";
import { tokenService } from "./token.service.js";
import { sessionService } from "./session.service.js";
import { mfaService } from "./mfa.service.js";

import type {
  AuthenticatedRole,
  AuthenticatedUser,
  ChangePasswordResult,
  LoginResponse,
  LoginResult,
  LogoutResult,
  PasswordResetResult,
  PasswordResetRequestResult,
  RegisterResult,
  RefreshTokenResult,
  VerifyEmailResult,
} from "./auth.types.js";

interface RegisterInput {
  email: string;
  firstName: string;
  lastName: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface VerifyEmailInput {
  email: string;
  otp: string;
}

interface ForgotPasswordInput {
  email: string;
}

interface VerifyPasswordResetOtpInput {
  email: string;
  otp: string;
}

interface ResetPasswordInput {
  token: string;
  password: string;
  confirmPassword: string;
}

interface ChangePasswordInput {
  userId: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export class AuthService {
  /**
   * Register a new user.
   *
   * New users are created as PENDING and receive:
   * 1. A cryptographically secure temporary password.
   * 2. An email verification OTP.
   *
   * The temporary password itself is never stored.
   */
  async register(
    input: RegisterInput,
  ): Promise<RegisterResult> {
    const email = input.email.trim().toLowerCase();

    try {
      console.log(
        `[AUTH][REGISTER] Starting registration for ${email}`,
      );

      const existingUser =
        await prisma.user.findUnique({
          where: {
            email,
          },
        });

      if (existingUser) {
        console.warn(
          `[AUTH][REGISTER] Registration rejected because the email already exists: ${email}`,
        );

        throw new Error(
          "Unable to create account with these details.",
        );
      }

      console.log(
        `[AUTH][REGISTER] Generating temporary password for ${email}`,
      );

      const temporaryPassword =
        this.generateTemporaryPassword();

      const passwordHash =
        await passwordService.hash(
          temporaryPassword,
        );

      console.log(
        `[AUTH][REGISTER] Creating PENDING user for ${email}`,
      );

      const user =
        await prisma.$transaction(
          async (tx) => {
            const createdUser =
              await tx.user.create({
                data: {
                  email,
                  firstName:
                    input.firstName.trim(),
                  lastName:
                    input.lastName.trim(),
                  passwordHash,
                  status: "PENDING",
                  isEmailVerified: false,
                  mustResetPassword: true,
                },
              });

            await tx.passwordHistory.create({
              data: {
                userId: createdUser.id,
                passwordHash,
              },
            });

            return createdUser;
          },
        );

      console.log(
        `[AUTH][REGISTER] User created successfully. userId=${user.id}`,
      );

      let otp: Awaited<
        ReturnType<typeof otpService.generate>
      >;

      try {
        console.log(
          `[AUTH][REGISTER] Generating email verification OTP. userId=${user.id}`,
        );

        otp = await otpService.generate(
          user.id,
          "EMAIL_VERIFICATION",
        );

        console.log(
          `[AUTH][REGISTER] OTP generated successfully. userId=${user.id}`,
        );
      } catch (error) {
        console.error(
          `[AUTH][REGISTER] OTP generation failed. userId=${user.id}`,
          error,
        );

        /*
         * The account cannot complete registration without
         * a verification OTP. Remove the incomplete account
         * so the user can safely retry registration.
         */
        try {
          await prisma.user.delete({
            where: {
              id: user.id,
            },
          });
        } catch (cleanupError) {
          console.error(
            `[AUTH][REGISTER] Failed to clean up user after OTP failure. userId=${user.id}`,
            cleanupError,
          );
        }

        throw new Error(
          "Unable to create account with these details.",
        );
      }

      try {
        console.log(
          `[AUTH][REGISTER] Sending registration emails. userId=${user.id}`,
        );

        await Promise.all([
          emailService.sendTemporaryPasswordEmail(
            user.email,
            user.firstName,
            temporaryPassword,
          ),

          emailService.sendEmailVerificationOtp(
            user.email,
            user.firstName,
            otp.code,
            env.otpExpiryMinutes,
          ),
        ]);

        console.log(
          `[AUTH][REGISTER] Registration emails sent successfully. userId=${user.id}`,
        );
      } catch (error) {
        console.error(
          `[AUTH][REGISTER] Registration email delivery failed. userId=${user.id}`,
          error,
        );

        /*
         * The temporary password and verification OTP are
         * only useful together with this registration.
         * Remove the incomplete account so the user can
         * retry registration cleanly.
         */
        try {
          await prisma.user.delete({
            where: {
              id: user.id,
            },
          });

          console.log(
            `[AUTH][REGISTER] Incomplete registration cleaned up. userId=${user.id}`,
          );
        } catch (cleanupError) {
          console.error(
            `[AUTH][REGISTER] Failed to clean up incomplete registration. userId=${user.id}`,
            cleanupError,
          );
        }

        throw new Error(
          "Unable to create account with these details.",
        );
      }

      try {
        await this.createAuditLog({
          eventType: "USER_REGISTERED",
          severity: "INFO",
          actorUserId: user.id,
          resourceType: "USER",
          resourceId: user.id,
        });

        await this.createAuditLog({
          eventType:
            "EMAIL_VERIFICATION_REQUESTED",
          severity: "INFO",
          actorUserId: user.id,
          resourceType: "USER",
          resourceId: user.id,
        });
      } catch (error) {
        /*
         * Audit failure must not turn a successfully completed
         * registration into a failed registration. Log the
         * internal problem for operations/diagnostics.
         */
        console.error(
          `[AUTH][REGISTER] Audit logging failed after successful registration. userId=${user.id}`,
          error,
        );
      }

      console.log(
        `[AUTH][REGISTER] Registration completed successfully. userId=${user.id}`,
      );

      return {
        userId: user.id,
        email: user.email,
        status: user.status,
        emailVerificationRequired: true,
        mustResetPassword: true,
      };
    } catch (error) {
      /*
       * Never expose internal database, hashing, OTP, SMTP,
       * or infrastructure details through the API.
       *
       * The controller receives only this safe message.
       */
      if (
        error instanceof Error &&
        error.message ===
          "Unable to create account with these details."
      ) {
        throw error;
      }

      console.error(
        `[AUTH][REGISTER] Unexpected registration failure for ${email}`,
        error,
      );

      throw new Error(
        "Unable to create account with these details.",
      );
    }
  }

  /**
   * Verify the user's email using the latest OTP.
   *
   * Once verified, the account moves from PENDING to ACTIVE.
   */
  async verifyEmail(
    input: VerifyEmailInput,
  ): Promise<VerifyEmailResult> {
    const email = input.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error(
        "Invalid verification request.",
      );
    }

    if (user.isEmailVerified) {
      return {
        userId: user.id,
        email: user.email,
        emailVerified: true,
        status: user.status,
      };
    }

    const verified = await otpService.verify(
      user.id,
      "EMAIL_VERIFICATION",
      input.otp,
    );

    if (!verified) {
      await this.createAuditLog({
        eventType: "OTP_FAILED",
        severity: "WARNING",
        actorUserId: user.id,
        resourceType: "USER",
        resourceId: user.id,
      });

      throw new Error(
        "Invalid or expired verification code.",
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
        status:
          user.status === "PENDING"
            ? "ACTIVE"
            : user.status,
      },
    });

    await this.createAuditLog({
      eventType: "OTP_VERIFIED",
      severity: "INFO",
      actorUserId: user.id,
      resourceType: "USER",
      resourceId: user.id,
    });

    await this.createAuditLog({
      eventType: "EMAIL_VERIFIED",
      severity: "INFO",
      actorUserId: user.id,
      resourceType: "USER",
      resourceId: user.id,
    });

    return {
      userId: updatedUser.id,
      email: updatedUser.email,
      emailVerified: updatedUser.isEmailVerified,
      status: updatedUser.status,
    };
  }

  /**
   * Resend email verification OTP.
   */
  async resendEmailVerification(
    emailInput: string,
  ): Promise<void> {
    const email = emailInput.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    /*
     * Deliberately return without revealing whether
     * the account exists.
     */
    if (!user || user.isEmailVerified) {
      return;
    }

    const otp = await otpService.generate(
      user.id,
      "EMAIL_VERIFICATION",
    );

    await emailService.sendEmailVerificationOtp(
      user.email,
      user.firstName,
      otp.code,
      env.otpExpiryMinutes,
    );

    await this.createAuditLog({
      eventType: "EMAIL_VERIFICATION_REQUESTED",
      severity: "INFO",
      actorUserId: user.id,
      resourceType: "USER",
      resourceId: user.id,
    });
  }

  /**
   * Login using email and password.
   */
  async login(
    input: LoginInput,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<LoginResponse> {
    const email = input.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      await this.createAuditLog({
        eventType: "LOGIN_FAILED",
        severity: "WARNING",
        resourceType: "AUTHENTICATION",
        ipAddress,
        userAgent,
      });

      throw new Error(
        "Invalid email or password.",
      );
    }

    if (user.status === "LOCKED") {
      if (
        user.lockedUntil &&
        user.lockedUntil <= new Date()
      ) {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            status: "ACTIVE",
            lockedUntil: null,
            failedLoginAttempts: 0,
          },
        });

        await this.createAuditLog({
          eventType: "ACCOUNT_UNLOCKED",
          severity: "INFO",
          actorUserId: user.id,
          resourceType: "USER",
          resourceId: user.id,
          ipAddress,
          userAgent,
        });
      } else {
        throw new Error(
          "Account is temporarily locked. Please try again later.",
        );
      }
    }

    if (
      user.status === "SUSPENDED" ||
      user.status === "DISABLED"
    ) {
      throw new Error(
        "This account is not available for login.",
      );
    }

    const passwordValid =
      await passwordService.verify(
        user.passwordHash,
        input.password,
      );

    if (!passwordValid) {
      await this.handleFailedLogin(user.id);

      await this.createAuditLog({
        eventType: "LOGIN_FAILED",
        severity: "WARNING",
        actorUserId: user.id,
        resourceType: "USER",
        resourceId: user.id,
        ipAddress,
        userAgent,
      });

      throw new Error(
        "Invalid email or password.",
      );
    }

    if (!user.isEmailVerified) {
      throw new Error(
        "Please verify your email address before logging in.",
      );
    }

    /*
     * Temporary passwords are only bootstrap credentials.
     * They must never establish an authenticated session.
     *
     * The user must complete the verified password-reset flow
     * before continuing with authentication.
     */
    if (user.mustResetPassword) {
      await this.createAuditLog({
        eventType: "LOGIN_FAILED",
        severity: "WARNING",
        actorUserId: user.id,
        resourceType: "USER",
        resourceId: user.id,
        ipAddress,
        userAgent,
        metadata: {
          requiresPasswordReset: true,
        },
      });

      throw new Error(
        "Password reset completion requires the verified reset flow.",
      );
    }

    /*
     * Password verification is complete, but authentication is
     * NOT complete yet.
     *
     * Do not:
     * - create a session
     * - issue an access token
     * - issue a refresh token
     * - record LOGIN_SUCCESS
     * - update lastLoginAt
     *
     * MFA must be completed first.
     */
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    const mfaStatus =
      await mfaService.getStatus(user.id);

    /*
     * Every Credora login requires MFA.
     *
     * If the user has not enrolled in MFA yet, stop here and
     * require MFA setup. No authenticated session is created.
     */
    if (
      !mfaStatus.enabled ||
      !mfaStatus.verifiedAt
    ) {
      return {
        requiresMfaSetup: true,
        userId: user.id,
      };
    }

    /*
     * MFA is configured and verified.
     *
     * Create only a short-lived MFA challenge.
     * This challenge is NOT an authenticated session.
     */
    const challenge =
      await mfaService.createChallenge(
        user.id,
      );

    await this.createAuditLog({
      eventType: "MFA_CHALLENGE_CREATED",
      severity: "INFO",
      actorUserId: user.id,
      resourceType: "MFA_CHALLENGE",
      resourceId: challenge.challengeId,
      ipAddress,
      userAgent,
    });

    return {
      requiresMfa: true,
      challengeId: challenge.challengeId,
      expiresAt: challenge.expiresAt,
    };
  }
  /**
   * Verify MFA during login and establish the authenticated session.
   *
   * Password authentication has already succeeded and produced
   * a short-lived MFA challenge. Only successful MFA verification
   * is allowed to create the application session and issue tokens.
   */
  async verifyMfa(
    challengeId: string,
    token: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<LoginResult> {
    const challenge =
      await mfaService.getActiveChallenge(
        challengeId,
      );

    if (!challenge) {
      await this.createAuditLog({
        eventType: "MFA_FAILED",
        severity: "WARNING",
        resourceType: "MFA_CHALLENGE",
        resourceId: challengeId,
        ipAddress,
        userAgent,
      });

      throw new Error(
        "Invalid or expired MFA challenge.",
      );
    }

    const verified =
      await mfaService.verifyToken(
        challenge.userId,
        token,
      );

    if (!verified) {
      const attemptResult =
        await mfaService.recordFailedAttempt(
          challengeId,
        );

      await this.createAuditLog({
        eventType: attemptResult.locked
          ? "MFA_LOCKED"
          : "MFA_FAILED",
        severity: "WARNING",
        actorUserId: challenge.userId,
        resourceType: "MFA_CHALLENGE",
        resourceId: challengeId,
        ipAddress,
        userAgent,
        metadata: {
          attempts: attemptResult.attempts,
          locked: attemptResult.locked,
        },
      });

      if (attemptResult.locked) {
        throw new Error(
          "MFA challenge is locked. Please start login again.",
        );
      }

      throw new Error(
        "Invalid MFA code.",
      );
    }

    await mfaService.consumeChallenge(
      challengeId,
    );

    const updatedUser =
      await prisma.user.update({
        where: {
          id: challenge.userId,
        },
        data: {
          failedLoginAttempts: 0,
          lockedUntil: null,
          lastLoginAt: new Date(),
        },
      });

    const sessionExpiresAt = new Date(
      Date.now() +
        securityConfig.session.refreshTokenDays *
          24 *
          60 *
          60 *
          1000,
    );

    const session =
      await sessionService.createSession({
        userId: updatedUser.id,
        ipAddress,
        userAgent,
        expiresAt: sessionExpiresAt,
      });

    const accessToken =
      jwtService.generateAccessToken(
        updatedUser.id,
        session.sessionId,
      );

    const authenticatedUser =
      await this.getAuthenticatedUser(
        updatedUser.id,
      );

    await this.createAuditLog({
      eventType: "MFA_SUCCESS",
      severity: "INFO",
      actorUserId: updatedUser.id,
      resourceType: "MFA_CHALLENGE",
      resourceId: challengeId,
      ipAddress,
      userAgent,
    });

    await this.createAuditLog({
      eventType: "LOGIN_SUCCESS",
      severity: "INFO",
      actorUserId: updatedUser.id,
      resourceType: "USER",
      resourceId: updatedUser.id,
      ipAddress,
      userAgent,
    });

    await this.createAuditLog({
      eventType: "SESSION_CREATED",
      severity: "INFO",
      actorUserId: updatedUser.id,
      resourceType: "SESSION",
      resourceId: session.sessionId,
      ipAddress,
      userAgent,
    });

    return {
      user: authenticatedUser,
      tokens: {
        accessToken,
        refreshToken: session.refreshToken,
        accessTokenExpiresIn:
          env.accessTokenExpiresIn,
        refreshTokenExpiresAt:
          session.expiresAt,
      },
      session: {
        sessionId: session.sessionId,
        expiresAt: session.expiresAt,
      },
    };
  }
  /**
   * Refresh an access token and rotate the refresh token.
   */
  async refreshSession(
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<RefreshTokenResult> {
    const session =
      await sessionService.findActiveSession(
        refreshToken,
      );

    if (!session) {
      throw new Error(
        "Invalid or expired session.",
      );
    }

    const rotated =
      await sessionService.rotateSession(
        refreshToken,
        ipAddress,
        userAgent,
      );

    if (!rotated) {
      throw new Error(
        "Unable to refresh session.",
      );
    }

    const accessToken =
      jwtService.generateAccessToken(
        session.user.id,
        rotated.sessionId,
      );

    await this.createAuditLog({
      eventType: "SESSION_REFRESHED",
      severity: "INFO",
      actorUserId: session.user.id,
      resourceType: "SESSION",
      resourceId: rotated.sessionId,
      ipAddress,
      userAgent,
    });

    return {
      accessToken,
      refreshToken: rotated.refreshToken,
      accessTokenExpiresIn:
        env.accessTokenExpiresIn,
      refreshTokenExpiresAt:
        rotated.expiresAt,
      sessionId: rotated.sessionId,
    };
  }

  /**
   * Logout one session.
   */
  async logout(
    refreshToken: string,
    userId?: string,
  ): Promise<LogoutResult> {
    const session =
      await sessionService.findActiveSession(
        refreshToken,
      );

    if (!session) {
      return {
        success: true,
      };
    }

    if (
      userId &&
      session.userId !== userId
    ) {
      throw new Error(
        "Invalid session.",
      );
    }

    await sessionService.revokeSession(
      session.id,
    );

    await this.createAuditLog({
      eventType: "SESSION_REVOKED",
      severity: "INFO",
      actorUserId: session.userId,
      resourceType: "SESSION",
      resourceId: session.id,
    });

    await this.createAuditLog({
      eventType: "LOGOUT",
      severity: "INFO",
      actorUserId: session.userId,
      resourceType: "SESSION",
      resourceId: session.id,
    });

    return {
      success: true,
    };
  }

  /**
   * Logout all sessions for the authenticated user.
   */
  async logoutAll(
    userId: string,
  ): Promise<LogoutResult> {
    await sessionService.revokeAllUserSessions(
      userId,
    );

    await this.createAuditLog({
      eventType: "LOGOUT_ALL_SESSIONS",
      severity: "INFO",
      actorUserId: userId,
      resourceType: "USER",
      resourceId: userId,
    });

    return {
      success: true,
    };
  }

  /**
   * Request a password reset.
   *
   * A generic success response prevents account enumeration.
   */
  async requestPasswordReset(
    input: ForgotPasswordInput,
  ): Promise<PasswordResetRequestResult> {
    const email = input.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        success: true,
      };
    }

    if (
      user.status === "DISABLED" ||
      user.status === "SUSPENDED"
    ) {
      return {
        success: true,
      };
    }

    const otp = await otpService.generate(
      user.id,
      "PASSWORD_RESET",
    );

    await emailService.sendPasswordResetOtp(
      user.email,
      user.firstName,
      otp.code,
      env.otpExpiryMinutes,
    );

    await this.createAuditLog({
      eventType: "PASSWORD_RESET_REQUESTED",
      severity: "INFO",
      actorUserId: user.id,
      resourceType: "USER",
      resourceId: user.id,
    });

    return {
      success: true,
    };
  }

  /**
   * Verify a password-reset OTP.
   *
   * A successful OTP verification generates a separate
   * short-lived, single-use reset token.
   */
  async verifyPasswordResetOtp(
    input: VerifyPasswordResetOtpInput,
  ): Promise<{ resetToken: string }> {
    const email = input.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error(
        "Invalid or expired verification code.",
      );
    }

    if (
      user.status === "DISABLED" ||
      user.status === "SUSPENDED"
    ) {
      throw new Error(
        "Invalid or expired verification code.",
      );
    }

    const verified = await otpService.verify(
      user.id,
      "PASSWORD_RESET",
      input.otp,
    );

    if (!verified) {
      await this.createAuditLog({
        eventType: "OTP_FAILED",
        severity: "WARNING",
        actorUserId: user.id,
        resourceType: "USER",
        resourceId: user.id,
      });

      throw new Error(
        "Invalid or expired verification code.",
      );
    }

    await prisma.passwordResetToken.updateMany({
      where: {
        userId: user.id,
        status: "ACTIVE",
      },
      data: {
        status: "REVOKED",
      },
    });

    const resetToken =
      tokenService.generatePasswordResetToken();

    const tokenHash =
      tokenService.hashToken(resetToken);

    const expiresAt = new Date(
      Date.now() +
        securityConfig.resetToken.expiryMinutes *
          60 *
          1000,
    );

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        status: "ACTIVE",
        expiresAt,
      },
    });

    await this.createAuditLog({
      eventType: "OTP_VERIFIED",
      severity: "INFO",
      actorUserId: user.id,
      resourceType: "USER",
      resourceId: user.id,
      metadata: {
        purpose: "PASSWORD_RESET",
      },
    });

    return {
      resetToken,
    };
  }

  /**
   * Complete password reset using a verified reset token.
   */
  async resetPassword(
    input: ResetPasswordInput,
  ): Promise<PasswordResetResult> {
    if (
      input.password !==
      input.confirmPassword
    ) {
      throw new Error(
        "Passwords do not match.",
      );
    }

    passwordService.validatePassword(
      input.password,
    );

    const tokenHash =
      tokenService.hashToken(input.token);

    const resetToken =
      await prisma.passwordResetToken.findUnique({
        where: {
          tokenHash,
        },
        include: {
          user: true,
        },
      });

    if (!resetToken) {
      throw new Error(
        "Invalid or expired reset token.",
      );
    }

    if (
      resetToken.status !== "ACTIVE"
    ) {
      throw new Error(
        "Invalid or expired reset token.",
      );
    }

    if (
      resetToken.expiresAt <= new Date()
    ) {
      await prisma.passwordResetToken.update({
        where: {
          id: resetToken.id,
        },
        data: {
          status: "EXPIRED",
        },
      });

      throw new Error(
        "Invalid or expired reset token.",
      );
    }

    const user = resetToken.user;

    if (
      user.status === "DISABLED" ||
      user.status === "SUSPENDED"
    ) {
      throw new Error(
        "Unable to reset password.",
      );
    }

    const history =
      await prisma.passwordHistory.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        take:
          securityConfig.password.historyCount,
      });

    const reused =
      await passwordService.isPasswordReused(
        input.password,
        history.map(
          (entry) => entry.passwordHash,
        ),
      );

    if (reused) {
      throw new Error(
        "You cannot reuse a recent password.",
      );
    }

    const newPasswordHash =
      await passwordService.hash(
        input.password,
      );

    await prisma.$transaction(
      async (tx) => {
        await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            passwordHash:
              newPasswordHash,
            passwordChangedAt:
              new Date(),
            mustResetPassword: false,
            failedLoginAttempts: 0,
            lockedUntil: null,
          },
        });

        await tx.passwordHistory.create({
          data: {
            userId: user.id,
            passwordHash:
              newPasswordHash,
          },
        });

        await tx.passwordResetToken.update({
          where: {
            id: resetToken.id,
          },
          data: {
            status: "USED",
            usedAt: new Date(),
          },
        });

        await tx.passwordResetToken.updateMany({
          where: {
            userId: user.id,
            status: "ACTIVE",
            id: {
              not: resetToken.id,
            },
          },
          data: {
            status: "REVOKED",
          },
        });
      },
    );

    /*
     * Password reset invalidates every existing session.
     */
    await sessionService.revokeAllUserSessions(
      user.id,
    );

    await this.createAuditLog({
      eventType: "PASSWORD_RESET_COMPLETED",
      severity: "CRITICAL",
      actorUserId: user.id,
      resourceType: "USER",
      resourceId: user.id,
    });

    await emailService.sendPasswordChangedEmail(
      user.email,
      user.firstName,
    );

    return {
      success: true,
    };
  }

  /**
   * Change the authenticated user's password.
   */
  async changePassword(
    input: ChangePasswordInput,
  ): Promise<ChangePasswordResult> {
    if (
      input.newPassword !==
      input.confirmPassword
    ) {
      throw new Error(
        "Passwords do not match.",
      );
    }

    passwordService.validatePassword(
      input.newPassword,
    );

    const user = await prisma.user.findUnique({
      where: {
        id: input.userId,
      },
    });

    if (!user) {
      throw new Error(
        "Unable to change password.",
      );
    }

    const currentPasswordValid =
      await passwordService.verify(
        user.passwordHash,
        input.currentPassword,
      );

    if (!currentPasswordValid) {
      throw new Error(
        "Current password is incorrect.",
      );
    }

    const history =
      await prisma.passwordHistory.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        take:
          securityConfig.password.historyCount,
      });

    const reused =
      await passwordService.isPasswordReused(
        input.newPassword,
        history.map(
          (entry) => entry.passwordHash,
        ),
      );

    if (reused) {
      throw new Error(
        "You cannot reuse a recent password.",
      );
    }

    const newPasswordHash =
      await passwordService.hash(
        input.newPassword,
      );

    await prisma.$transaction(
      async (tx) => {
        await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            passwordHash:
              newPasswordHash,
            passwordChangedAt:
              new Date(),
            mustResetPassword: false,
          },
        });

        await tx.passwordHistory.create({
          data: {
            userId: user.id,
            passwordHash:
              newPasswordHash,
          },
        });
      },
    );

    await sessionService.revokeAllUserSessions(
      user.id,
    );

    await this.createAuditLog({
      eventType: "PASSWORD_CHANGED",
      severity: "INFO",
      actorUserId: user.id,
      resourceType: "USER",
      resourceId: user.id,
    });

    await emailService.sendPasswordChangedEmail(
      user.email,
      user.firstName,
    );

    return {
      success: true,
    };
  }

  /**
   * Resolve the authenticated user with active
   * roles and permissions.
   */
  async getAuthenticatedUser(
    userId: string,
  ): Promise<AuthenticatedUser> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        roles: {
          where: {
            role: {
              isActive: true,
            },
          },
          include: {
            role: {
              include: {
                permissions: {
                  where: {
                    permission: {
                      isActive: true,
                    },
                  },
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error(
        "User account not found.",
      );
    }

    const roles: AuthenticatedRole[] =
      user.roles.map(
        (userRole) => ({
          id: userRole.role.id,
          code: userRole.role.code,
          name: userRole.role.name,
          type: userRole.role.type,
          permissions:
            userRole.role.permissions.map(
              (rolePermission) => ({
                id: rolePermission.permission.id,
                code:
                  rolePermission.permission
                    .code,
                module:
                  rolePermission.permission
                    .module,
                action:
                  rolePermission.permission
                    .action,
                description:
                  rolePermission.permission
                    .description,
              }),
            ),
        }),
      );

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      isEmailVerified:
        user.isEmailVerified,
      mustResetPassword:
        user.mustResetPassword,
      roles,
    };
  }

  /**
   * Generate a temporary password using
   * cryptographically secure randomness.
   */
  private generateTemporaryPassword(): string {
    const uppercase =
      "ABCDEFGHJKLMNPQRSTUVWXYZ";

    const lowercase =
      "abcdefghijkmnopqrstuvwxyz";

    const numbers =
      "23456789";

    const special =
      "!@#$%^&*";

    const all =
      uppercase +
      lowercase +
      numbers +
      special;

    const randomCharacter = (
      characters: string,
    ): string => {
      const index =
        randomBytes(1)[0] %
        characters.length;

      return characters[index];
    };

    const required = [
      randomCharacter(uppercase),
      randomCharacter(lowercase),
      randomCharacter(numbers),
      randomCharacter(special),
    ];

    while (required.length < 20) {
      required.push(
        randomCharacter(all),
      );
    }

    for (
      let index = required.length - 1;
      index > 0;
      index--
    ) {
      const randomIndex =
        randomBytes(1)[0] %
        (index + 1);

      [
        required[index],
        required[randomIndex],
      ] = [
        required[randomIndex],
        required[index],
      ];
    }

    return required.join("");
  }

  /**
   * Handle failed login attempts and account lockout.
   */
  private async handleFailedLogin(
    userId: string,
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return;
    }

    const failedAttempts =
      user.failedLoginAttempts + 1;

    if (
      failedAttempts >=
      securityConfig.login.maxFailedAttempts
    ) {
      const lockedUntil =
        new Date(
          Date.now() +
            securityConfig.login
              .lockDurationMinutes *
              60 *
              1000,
        );

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          failedLoginAttempts:
            failedAttempts,
          status: "LOCKED",
          lockedUntil,
        },
      });

      await this.createAuditLog({
        eventType:
          "ACCOUNT_LOCKED",
        severity: "CRITICAL",
        actorUserId: user.id,
        resourceType: "USER",
        resourceId: user.id,
      });

      return;
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        failedLoginAttempts:
          failedAttempts,
      },
    });
  }

  /**
   * Calculate refresh-token/session expiry.
   */
  private async createAuditLog(input: {
    eventType:
      | "USER_REGISTERED"
      | "USER_UPDATED"
      | "EMAIL_VERIFICATION_REQUESTED"
      | "EMAIL_VERIFIED"
      | "LOGIN_SUCCESS"
      | "LOGIN_FAILED"
      | "MFA_CHALLENGE_CREATED"
      | "MFA_SUCCESS"
      | "MFA_FAILED"
      | "MFA_LOCKED"
      | "MFA_ENABLED"
      | "MFA_DISABLED"
      | "ACCOUNT_LOCKED"
      | "ACCOUNT_UNLOCKED"
      | "ACCOUNT_SUSPENDED"
      | "ACCOUNT_REACTIVATED"
      | "PASSWORD_RESET_REQUESTED"
      | "PASSWORD_RESET_COMPLETED"
      | "PASSWORD_CHANGED"
      | "SESSION_CREATED"
      | "SESSION_REFRESHED"
      | "SESSION_REVOKED"
      | "LOGOUT"
      | "LOGOUT_ALL_SESSIONS"
      | "ROLE_ASSIGNED"
      | "ROLE_REMOVED"
      | "PERMISSION_ASSIGNED"
      | "PERMISSION_REMOVED"
      | "PERMISSION_CHANGED"
      | "OTP_GENERATED"
      | "OTP_VERIFIED"
      | "OTP_FAILED"
      | "OTP_EXPIRED"
      | "SECURITY_POLICY_CHANGED";
    severity:
      | "INFO"
      | "WARNING"
      | "CRITICAL";
    actorUserId?: string;
    resourceType?: string;
    resourceId?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Prisma.InputJsonValue;
  }): Promise<void> {
    await prisma.auditLog.create({
      data: {
        eventType: input.eventType,
        severity: input.severity,
        actorUserId: input.actorUserId,
        resourceType: input.resourceType,
        resourceId: input.resourceId,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        metadata: input.metadata,
      },
    });
  }
}

export const authService =
  new AuthService();





