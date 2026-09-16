import { randomInt } from "node:crypto";

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
  MfaSetupResult,
  MfaSetupVerificationResult,
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

interface TemporaryPasswordLoginResult {
  requiresPasswordReset: true;
  resetToken: string;
  expiresAt: Date;
}

export class AuthService {
  async register(
    input: RegisterInput,
  ): Promise<RegisterResult> {
    const email =
      input.email.trim().toLowerCase();

    try {
      const existingUser =
        await prisma.user.findUnique({
          where: { email },
        });

      if (existingUser) {
        throw new Error(
          "Unable to create account with these details.",
        );
      }

      const temporaryPassword =
        this.generateTemporaryPassword();

      const passwordHash =
        await passwordService.hash(
          temporaryPassword,
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

      let otp: Awaited<
        ReturnType<
          typeof otpService.generate
        >
      >;

      try {
        otp =
          await otpService.generate(
            user.id,
            "EMAIL_VERIFICATION",
          );
      } catch (error) {
        await this.deleteIncompleteUser(
          user.id,
        );

        console.error(
          "[AUTH][REGISTER] OTP generation failed.",
          error,
        );

        throw new Error(
          "Unable to create account with these details.",
        );
      }

      try {
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
      } catch (error) {
        await this.deleteIncompleteUser(
          user.id,
        );

        console.error(
          "[AUTH][REGISTER] Registration email delivery failed.",
          error,
        );

        throw new Error(
          "Unable to create account with these details.",
        );
      }

      await this.safeAuditLog({
        eventType: "USER_REGISTERED",
        severity: "INFO",
        actorUserId: user.id,
        resourceType: "USER",
        resourceId: user.id,
      });

      await this.safeAuditLog({
        eventType:
          "EMAIL_VERIFICATION_REQUESTED",
        severity: "INFO",
        actorUserId: user.id,
        resourceType: "USER",
        resourceId: user.id,
      });

      return {
        userId: user.id,
        email: user.email,
        status: user.status,
        emailVerificationRequired: true,
        mustResetPassword: true,
      };
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "Unable to create account with these details."
      ) {
        throw error;
      }

      console.error(
        "[AUTH][REGISTER] Unexpected registration failure.",
        error,
      );

      throw new Error(
        "Unable to create account with these details.",
      );
    }
  }

  async verifyEmail(
    input: VerifyEmailInput,
  ): Promise<VerifyEmailResult> {
    const email =
      input.email.trim().toLowerCase();

    const user =
      await prisma.user.findUnique({
        where: { email },
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

    const verified =
      await otpService.verify(
        user.id,
        "EMAIL_VERIFICATION",
        input.otp,
      );

    if (!verified) {
      await this.safeAuditLog({
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

    const updatedUser =
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isEmailVerified: true,
          emailVerifiedAt: new Date(),
          status:
            user.status === "PENDING"
              ? "ACTIVE"
              : user.status,
        },
      });

    await this.safeAuditLog({
      eventType: "OTP_VERIFIED",
      severity: "INFO",
      actorUserId: user.id,
      resourceType: "USER",
      resourceId: user.id,
    });

    await this.safeAuditLog({
      eventType: "EMAIL_VERIFIED",
      severity: "INFO",
      actorUserId: user.id,
      resourceType: "USER",
      resourceId: user.id,
    });

    return {
      userId: updatedUser.id,
      email: updatedUser.email,
      emailVerified:
        updatedUser.isEmailVerified,
      status: updatedUser.status,
    };
  }

  async resendEmailVerification(
    emailInput: string,
  ): Promise<void> {
    const email =
      emailInput.trim().toLowerCase();

    const user =
      await prisma.user.findUnique({
        where: { email },
      });

    if (!user || user.isEmailVerified) {
      return;
    }

    const otp =
      await otpService.generate(
        user.id,
        "EMAIL_VERIFICATION",
      );

    await emailService.sendEmailVerificationOtp(
      user.email,
      user.firstName,
      otp.code,
      env.otpExpiryMinutes,
    );

    await this.safeAuditLog({
      eventType:
        "EMAIL_VERIFICATION_REQUESTED",
      severity: "INFO",
      actorUserId: user.id,
      resourceType: "USER",
      resourceId: user.id,
    });
  }

  /**
   * Password stage of authentication.
   *
   * IMPORTANT:
   * Password verification alone NEVER creates
   * an authenticated session.
   *
   * Possible outcomes:
   *
   * 1. Temporary password user:
   *    - returns short-lived password reset token
   *    - no session
   *    - no access token
   *    - no refresh token
   *
   * 2. User without MFA:
   *    - returns MFA SETUP challenge
   *    - no session
   *    - no access token
   *    - no refresh token
   *
   * 3. User with MFA:
   *    - returns MFA LOGIN challenge
   *    - no session
   *    - no access token
   *    - no refresh token
   *
   * Only verifyMfa() creates the authenticated
   * session and authentication tokens.
   */
  async login(
    input: LoginInput,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<
    LoginResponse | TemporaryPasswordLoginResult
  > {
    const email =
      input.email.trim().toLowerCase();

    const user =
      await prisma.user.findUnique({
        where: { email },
      });

    if (!user) {
      await this.safeAuditLog({
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
          where: { id: user.id },
          data: {
            status: "ACTIVE",
            lockedUntil: null,
            failedLoginAttempts: 0,
          },
        });

        await this.safeAuditLog({
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
      await this.handleFailedLogin(
        user.id,
      );

      await this.safeAuditLog({
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

    /**
     * Temporary-password flow.
     *
     * The password was valid, but the account is
     * still required to establish a permanent password.
     *
     * We revoke any previous active reset tokens
     * before creating a new one.
     *
     * IMPORTANT:
     * No authenticated session is created.
     */
    if (user.mustResetPassword) {
      const resetToken =
        await this.createPasswordResetToken(
          user.id,
        );

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
      });

      await this.safeAuditLog({
        eventType:
          "PASSWORD_RESET_REQUESTED",
        severity: "INFO",
        actorUserId: user.id,
        resourceType: "USER",
        resourceId: user.id,
        ipAddress,
        userAgent,
        metadata: {
          source:
            "TEMPORARY_PASSWORD_LOGIN",
        },
      });

      return {
        requiresPasswordReset: true,
        resetToken:
          resetToken.token,
        expiresAt:
          resetToken.expiresAt,
      };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    const mfaStatus =
      await mfaService.getStatus(
        user.id,
      );

    /**
     * MFA enrollment has not been completed.
     *
     * Create a short-lived SETUP challenge.
     *
     * No access token.
     * No refresh token.
     * No authenticated session.
     */
    if (
      !mfaStatus.enabled ||
      !mfaStatus.verifiedAt
    ) {
      const setupChallenge =
        await mfaService.createChallenge(
          user.id,
          "SETUP",
        );

      await this.safeAuditLog({
        eventType:
          "MFA_CHALLENGE_CREATED",
        severity: "INFO",
        actorUserId: user.id,
        resourceType: "MFA_CHALLENGE",
        resourceId:
          setupChallenge.challengeId,
        ipAddress,
        userAgent,
        metadata: {
          purpose: "SETUP",
        },
      });

      return {
        requiresMfaSetup: true,
        setupChallengeId:
          setupChallenge.challengeId,
        expiresAt:
          setupChallenge.expiresAt,
      };
    }

    /**
     * MFA is already configured.
     *
     * Create a short-lived LOGIN challenge.
     *
     * Still no authenticated session.
     */
    const challenge =
      await mfaService.createChallenge(
        user.id,
        "LOGIN",
      );

    await this.safeAuditLog({
      eventType:
        "MFA_CHALLENGE_CREATED",
      severity: "INFO",
      actorUserId: user.id,
      resourceType: "MFA_CHALLENGE",
      resourceId: challenge.challengeId,
      ipAddress,
      userAgent,
      metadata: {
        purpose: "LOGIN",
      },
    });

    return {
      requiresMfa: true,
      challengeId:
        challenge.challengeId,
      expiresAt: challenge.expiresAt,
    };
  }

  /**
   * Generate TOTP enrollment information.
   *
   * This endpoint is allowed only with a valid SETUP
   * MFA challenge generated after password verification.
   */
  async setupMfa(
    challengeId: string,
  ): Promise<MfaSetupResult> {
    const challenge =
      await mfaService.getActiveChallenge(
        challengeId,
        "SETUP",
      );

    if (!challenge) {
      throw new Error(
        "Invalid or expired MFA setup challenge.",
      );
    }

    const user =
      await prisma.user.findUnique({
        where: {
          id: challenge.userId,
        },
        select: {
          id: true,
          email: true,
          status: true,
          isEmailVerified: true,
          mustResetPassword: true,
        },
      });

    if (!user) {
      throw new Error(
        "Invalid or expired MFA setup challenge.",
      );
    }

    if (
      user.status !== "ACTIVE" ||
      !user.isEmailVerified ||
      user.mustResetPassword
    ) {
      throw new Error(
        "MFA setup is not available for this account.",
      );
    }

    const setup =
      await mfaService.generateSetup(
        user.id,
        user.email,
      );

    await this.safeAuditLog({
      eventType:
        "MFA_CHALLENGE_CREATED",
      severity: "INFO",
      actorUserId: user.id,
      resourceType: "MFA_SETUP",
      resourceId: challenge.id,
      metadata: {
        purpose: "SETUP",
      },
    });

    return {
      challengeId: challenge.id,
      method: setup.method,
      secret: setup.secret,
      otpauthUrl: setup.otpauthUrl,
      qrCodeDataUrl:
        setup.qrCodeDataUrl,
      expiresAt: challenge.expiresAt,
    };
  }

  /**
   * Verify the first TOTP generated by the authenticator.
   *
   * Successful verification:
   * - enables MFA
   * - consumes the setup challenge
   * - does NOT create a normal session
   *
   * The client must subsequently log in again.
   */
  async verifyMfaSetup(
    challengeId: string,
    token: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<MfaSetupVerificationResult> {
    const challenge =
      await mfaService.getActiveChallenge(
        challengeId,
        "SETUP",
      );

    if (!challenge) {
      throw new Error(
        "Invalid or expired MFA setup challenge.",
      );
    }

    const verified =
      await mfaService.verifySetup(
        challenge.userId,
        token,
      );

    if (!verified) {
      const attemptResult =
        await mfaService.recordFailedAttempt(
          challengeId,
        );

      await this.safeAuditLog({
        eventType:
          attemptResult.locked
            ? "MFA_LOCKED"
            : "MFA_FAILED",
        severity: "WARNING",
        actorUserId:
          challenge.userId,
        resourceType: "MFA_SETUP",
        resourceId: challengeId,
        ipAddress,
        userAgent,
        metadata: {
          purpose: "SETUP",
          attempts:
            attemptResult.attempts,
          locked:
            attemptResult.locked,
        },
      });

      if (attemptResult.locked) {
        throw new Error(
          "MFA setup challenge is locked. Please start login again.",
        );
      }

      throw new Error(
        "Invalid MFA code.",
      );
    }

    await mfaService.consumeChallenge(
      challengeId,
    );

    await this.safeAuditLog({
      eventType: "MFA_ENABLED",
      severity: "CRITICAL",
      actorUserId: challenge.userId,
      resourceType: "MFA_CONFIGURATION",
      resourceId: challenge.userId,
      ipAddress,
      userAgent,
      metadata: {
        method: "TOTP",
      },
    });

    return {
      success: true,
      enabled: true,
    };
  }

  /**
   * Verify MFA during normal login.
   *
   * This is the ONLY path that creates the full
   * authenticated session after password authentication.
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
        "LOGIN",
      );

    if (!challenge) {
      await this.safeAuditLog({
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

      await this.safeAuditLog({
        eventType:
          attemptResult.locked
            ? "MFA_LOCKED"
            : "MFA_FAILED",
        severity: "WARNING",
        actorUserId:
          challenge.userId,
        resourceType: "MFA_CHALLENGE",
        resourceId: challengeId,
        ipAddress,
        userAgent,
        metadata: {
          purpose: "LOGIN",
          attempts:
            attemptResult.attempts,
          locked:
            attemptResult.locked,
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

    const sessionExpiresAt =
      new Date(
        Date.now() +
          securityConfig.session
            .refreshTokenDays *
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
        expiresAt:
          sessionExpiresAt,
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

    await this.safeAuditLog({
      eventType: "MFA_SUCCESS",
      severity: "INFO",
      actorUserId:
        updatedUser.id,
      resourceType:
        "MFA_CHALLENGE",
      resourceId: challengeId,
      ipAddress,
      userAgent,
    });

    await this.safeAuditLog({
      eventType: "LOGIN_SUCCESS",
      severity: "INFO",
      actorUserId:
        updatedUser.id,
      resourceType: "USER",
      resourceId:
        updatedUser.id,
      ipAddress,
      userAgent,
    });

    await this.safeAuditLog({
      eventType: "SESSION_CREATED",
      severity: "INFO",
      actorUserId:
        updatedUser.id,
      resourceType: "SESSION",
      resourceId:
        session.sessionId,
      ipAddress,
      userAgent,
    });

    return {
      user: authenticatedUser,
      tokens: {
        accessToken,
        refreshToken:
          session.refreshToken,
        accessTokenExpiresIn:
          env.accessTokenExpiresIn,
        refreshTokenExpiresAt:
          session.expiresAt,
      },
      session: {
        sessionId:
          session.sessionId,
        expiresAt:
          session.expiresAt,
      },
    };
  }

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

    await this.safeAuditLog({
      eventType: "SESSION_REFRESHED",
      severity: "INFO",
      actorUserId:
        session.user.id,
      resourceType: "SESSION",
      resourceId:
        rotated.sessionId,
      ipAddress,
      userAgent,
    });

    return {
      accessToken,
      refreshToken:
        rotated.refreshToken,
      accessTokenExpiresIn:
        env.accessTokenExpiresIn,
      refreshTokenExpiresAt:
        rotated.expiresAt,
      sessionId:
        rotated.sessionId,
    };
  }

  async logout(
    refreshToken: string,
    userId?: string,
  ): Promise<LogoutResult> {
    const session =
      await sessionService.findActiveSession(
        refreshToken,
      );

    if (!session) {
      return { success: true };
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

    await this.safeAuditLog({
      eventType: "SESSION_REVOKED",
      severity: "INFO",
      actorUserId:
        session.userId,
      resourceType: "SESSION",
      resourceId: session.id,
    });

    await this.safeAuditLog({
      eventType: "LOGOUT",
      severity: "INFO",
      actorUserId:
        session.userId,
      resourceType: "SESSION",
      resourceId: session.id,
    });

    return { success: true };
  }

  async logoutAll(
    userId: string,
  ): Promise<LogoutResult> {
    await sessionService.revokeAllUserSessions(
      userId,
    );

    await this.safeAuditLog({
      eventType: "LOGOUT_ALL_SESSIONS",
      severity: "INFO",
      actorUserId: userId,
      resourceType: "USER",
      resourceId: userId,
    });

    return { success: true };
  }

  async requestPasswordReset(
    input: ForgotPasswordInput,
  ): Promise<PasswordResetRequestResult> {
    const email =
      input.email.trim().toLowerCase();

    const user =
      await prisma.user.findUnique({
        where: { email },
      });

    if (!user) {
      return { success: true };
    }

    if (
      user.status === "DISABLED" ||
      user.status === "SUSPENDED"
    ) {
      return { success: true };
    }

    const otp =
      await otpService.generate(
        user.id,
        "PASSWORD_RESET",
      );

    await emailService.sendPasswordResetOtp(
      user.email,
      user.firstName,
      otp.code,
      env.otpExpiryMinutes,
    );

    await this.safeAuditLog({
      eventType:
        "PASSWORD_RESET_REQUESTED",
      severity: "INFO",
      actorUserId: user.id,
      resourceType: "USER",
      resourceId: user.id,
    });

    return { success: true };
  }

  async verifyPasswordResetOtp(
    input: VerifyPasswordResetOtpInput,
  ): Promise<{ resetToken: string }> {
    const email =
      input.email.trim().toLowerCase();

    const user =
      await prisma.user.findUnique({
        where: { email },
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

    const verified =
      await otpService.verify(
        user.id,
        "PASSWORD_RESET",
        input.otp,
      );

    if (!verified) {
      await this.safeAuditLog({
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

    const created =
      await this.createPasswordResetToken(
        user.id,
      );

    await this.safeAuditLog({
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
      resetToken: created.token,
    };
  }

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
      tokenService.hashToken(
        input.token,
      );

    const resetToken =
      await prisma.passwordResetToken.findUnique(
        {
          where: { tokenHash },
          include: { user: true },
        },
      );

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
      await prisma.passwordResetToken.update(
        {
          where: {
            id: resetToken.id,
          },
          data: {
            status: "EXPIRED",
          },
        },
      );

      throw new Error(
        "Invalid or expired reset token.",
      );
    }

    const user =
      resetToken.user;

    if (
      user.status === "DISABLED" ||
      user.status === "SUSPENDED"
    ) {
      throw new Error(
        "Unable to reset password.",
      );
    }

    const history =
      await prisma.passwordHistory.findMany(
        {
          where: {
            userId: user.id,
          },
          orderBy: {
            createdAt: "desc",
          },
          take:
            securityConfig.password
              .historyCount,
        },
      );

    const reused =
      await passwordService.isPasswordReused(
        input.password,
        history.map(
          (entry) =>
            entry.passwordHash,
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
            mustResetPassword:
              false,
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

        await tx.passwordResetToken.updateMany(
          {
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
          },
        );
      },
    );

    await sessionService.revokeAllUserSessions(
      user.id,
    );

    await this.safeAuditLog({
      eventType:
        "PASSWORD_RESET_COMPLETED",
      severity: "CRITICAL",
      actorUserId: user.id,
      resourceType: "USER",
      resourceId: user.id,
    });

    await emailService.sendPasswordChangedEmail(
      user.email,
      user.firstName,
    );

    return { success: true };
  }

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

    const user =
      await prisma.user.findUnique({
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
      await prisma.passwordHistory.findMany(
        {
          where: {
            userId: user.id,
          },
          orderBy: {
            createdAt: "desc",
          },
          take:
            securityConfig.password
              .historyCount,
        },
      );

    const reused =
      await passwordService.isPasswordReused(
        input.newPassword,
        history.map(
          (entry) =>
            entry.passwordHash,
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
            mustResetPassword:
              false,
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

    await this.safeAuditLog({
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

    return { success: true };
  }

  async getAuthenticatedUser(
    userId: string,
  ): Promise<AuthenticatedUser> {
    const user =
      await prisma.user.findUnique({
        where: { id: userId },
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
   * Creates a short-lived password-reset token.
   *
   * Only the SHA-256 hash is stored in the database.
   * The raw token is returned to the caller.
   *
   * Existing active reset tokens for the user are
   * revoked before creating the new token.
   */
  private async createPasswordResetToken(
    userId: string,
  ): Promise<{
    token: string;
    expiresAt: Date;
  }> {
    await prisma.passwordResetToken.updateMany({
      where: {
        userId,
        status: "ACTIVE",
      },
      data: {
        status: "REVOKED",
      },
    });

    const token =
      tokenService.generatePasswordResetToken();

    const tokenHash =
      tokenService.hashToken(token);

    const expiresAt =
      new Date(
        Date.now() +
          securityConfig.resetToken
            .expiryMinutes *
            60 *
            1000,
      );

    await prisma.passwordResetToken.create({
      data: {
        userId,
        tokenHash,
        status: "ACTIVE",
        expiresAt,
      },
    });

    return {
      token,
      expiresAt,
    };
  }

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
      return characters[
        randomInt(characters.length)
      ];
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
      let index =
        required.length - 1;
      index > 0;
      index--
    ) {
      const randomIndex =
        randomInt(index + 1);

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

  private async handleFailedLogin(
    userId: string,
  ): Promise<void> {
    const user =
      await prisma.user.findUnique({
        where: { id: userId },
      });

    if (!user) {
      return;
    }

    const failedAttempts =
      user.failedLoginAttempts + 1;

    if (
      failedAttempts >=
      securityConfig.login
        .maxFailedAttempts
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

      await this.safeAuditLog({
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

  private async deleteIncompleteUser(
    userId: string,
  ): Promise<void> {
    try {
      await prisma.user.delete({
        where: { id: userId },
      });
    } catch (error) {
      console.error(
        `[AUTH] Failed to clean up incomplete user ${userId}.`,
        error,
      );
    }
  }

  private async safeAuditLog(input: {
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
    try {
      await prisma.auditLog.create({
        data: {
          eventType:
            input.eventType,
          severity:
            input.severity,
          actorUserId:
            input.actorUserId,
          resourceType:
            input.resourceType,
          resourceId:
            input.resourceId,
          ipAddress:
            input.ipAddress,
          userAgent:
            input.userAgent,
          metadata:
            input.metadata,
        },
      });
    } catch (error) {
      console.error(
        "[AUTH] Audit logging failed.",
        error,
      );
    }
  }
}

export const authService =
  new AuthService();