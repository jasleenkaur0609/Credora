import type {
  Request,
  Response,
} from "express";

import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  mfaSetupSchema,
  registerSchema,
  resendEmailVerificationSchema,
  resetPasswordSchema,
  verifyEmailOtpSchema,
  verifyMfaSchema,
  verifyMfaSetupSchema,
  verifyPasswordResetOtpSchema,
} from "./auth.validation.js";

import { authService } from "./auth.service.js";
import { env } from "../../config/env.js";

function getClientIp(
  req: Request,
): string | undefined {
  const forwardedFor =
    req.headers["x-forwarded-for"];

  if (
    typeof forwardedFor === "string"
  ) {
    return forwardedFor
      .split(",")[0]
      ?.trim();
  }

  if (Array.isArray(forwardedFor)) {
    return forwardedFor[0];
  }

  return req.ip;
}

function getUserAgent(
  req: Request,
): string | undefined {
  return (
    req.get("user-agent") ??
    undefined
  );
}

function sendValidationError(
  res: Response,
  error: unknown,
): Response {
  if (
    error &&
    typeof error === "object" &&
    "issues" in error
  ) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: error.issues,
    });
  }

  return res.status(400).json({
    success: false,
    message: "Invalid request.",
  });
}

function getRefreshToken(
  req: Request,
): string | undefined {
  return req.cookies?.[
    env.sessionCookieName
  ];
}

export class AuthController {
  constructor() {
    this.register =
      this.register.bind(this);

    this.verifyEmail =
      this.verifyEmail.bind(this);

    this.resendVerification =
      this.resendVerification.bind(this);

    this.login =
      this.login.bind(this);

    this.setupMfa =
      this.setupMfa.bind(this);

    this.verifyMfaSetup =
      this.verifyMfaSetup.bind(this);

    this.verifyMfa =
      this.verifyMfa.bind(this);

    this.refresh =
      this.refresh.bind(this);

    this.logout =
      this.logout.bind(this);

    this.logoutAll =
      this.logoutAll.bind(this);

    this.forgotPassword =
      this.forgotPassword.bind(this);

    this.verifyPasswordResetOtp =
      this.verifyPasswordResetOtp.bind(
        this,
      );

    this.resetPassword =
      this.resetPassword.bind(this);

    this.changePassword =
      this.changePassword.bind(this);
  }

  async register(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const parsed =
      registerSchema.safeParse(
        req.body,
      );

    if (!parsed.success) {
      return sendValidationError(
        res,
        parsed.error,
      );
    }

    try {
      const result =
        await authService.register(
          parsed.data,
        );

      return res.status(201).json({
        success: true,
        message:
          "Account created. Check your email for your temporary password and verification code.",
        data: result,
      });
    } catch (error) {
      return this.handleError(
        res,
        error,
      );
    }
  }

  async verifyEmail(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const parsed =
      verifyEmailOtpSchema.safeParse(
        req.body,
      );

    if (!parsed.success) {
      return sendValidationError(
        res,
        parsed.error,
      );
    }

    try {
      const result =
        await authService.verifyEmail(
          parsed.data,
        );

      return res.status(200).json({
        success: true,
        message:
          "Email verified successfully.",
        data: result,
      });
    } catch (error) {
      return this.handleError(
        res,
        error,
      );
    }
  }

  async resendVerification(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const parsed =
      resendEmailVerificationSchema.safeParse(
        req.body,
      );

    if (!parsed.success) {
      return sendValidationError(
        res,
        parsed.error,
      );
    }

    try {
      await authService.resendEmailVerification(
        parsed.data.email,
      );

      return res.status(200).json({
        success: true,
        message:
          "If the account requires email verification, a new verification code has been sent.",
      });
    } catch (error) {
      return this.handleError(
        res,
        error,
      );
    }
  }

  /**
   * Password authentication stage.
   *
   * Possible responses:
   *
   * 1. Password reset required
   * 2. MFA setup required
   * 3. MFA verification required
   * 4. Fully authenticated response
   *
   * Only the final response sets the refresh-token
   * cookie because only that state represents a
   * fully authenticated session.
   */
  async login(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const parsed =
      loginSchema.safeParse(
        req.body,
      );

    if (!parsed.success) {
      return sendValidationError(
        res,
        parsed.error,
      );
    }

    try {
      const result =
        await authService.login(
          parsed.data,
          getClientIp(req),
          getUserAgent(req),
        );

      /**
       * Temporary password flow.
       *
       * No authenticated session is created.
       */
      if (
        "requiresPasswordReset" in
        result
      ) {
        return res.status(200).json({
          success: true,
          message:
            "Password reset is required before you can continue.",
          data: {
            requiresPasswordReset:
              true,
            resetToken:
              result.resetToken,
            expiresAt:
              result.expiresAt,
          },
        });
      }

      /**
       * First-time MFA enrollment.
       *
       * No authenticated session exists yet.
       */
      if (
        "requiresMfaSetup" in
        result
      ) {
        return res.status(200).json({
          success: true,
          message:
            "Multi-factor authentication setup is required.",
          data: {
            requiresMfaSetup: true,
            setupChallengeId:
              result.setupChallengeId,
            expiresAt:
              result.expiresAt,
          },
        });
      }

      /**
       * Existing MFA challenge.
       *
       * No authenticated session exists yet.
       */
      if (
        "requiresMfa" in result
      ) {
        return res.status(200).json({
          success: true,
          message:
            "Multi-factor authentication is required.",
          data: {
            requiresMfa: true,
            challengeId:
              result.challengeId,
            expiresAt:
              result.expiresAt,
          },
        });
      }

      /**
       * Only this branch creates the authenticated
       * refresh-token cookie.
       */
      this.setRefreshTokenCookie(
        res,
        result.tokens.refreshToken,
        result.tokens
          .refreshTokenExpiresAt,
      );

      return res.status(200).json({
        success: true,
        message: "Login successful.",
        data: {
          user: result.user,
          accessToken:
            result.tokens.accessToken,
          accessTokenExpiresIn:
            result.tokens
              .accessTokenExpiresIn,
          session: result.session,
        },
      });
    } catch (error) {
      return this.handleError(
        res,
        error,
      );
    }
  }

  /**
   * Generate TOTP setup information.
   *
   * A valid short-lived SETUP challenge
   * authorizes this operation.
   */
  async setupMfa(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const parsed =
      mfaSetupSchema.safeParse(
        req.body,
      );

    if (!parsed.success) {
      return sendValidationError(
        res,
        parsed.error,
      );
    }

    try {
      const result =
        await authService.setupMfa(
          parsed.data.challengeId,
        );

      return res.status(200).json({
        success: true,
        message:
          "MFA setup information generated.",
        data: result,
      });
    } catch (error) {
      return this.handleError(
        res,
        error,
      );
    }
  }

  /**
   * Verify the first TOTP during MFA enrollment.
   */
  async verifyMfaSetup(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const parsed =
      verifyMfaSetupSchema.safeParse(
        req.body,
      );

    if (!parsed.success) {
      return sendValidationError(
        res,
        parsed.error,
      );
    }

    try {
      const result =
        await authService.verifyMfaSetup(
          parsed.data.challengeId,
          parsed.data.token,
          getClientIp(req),
          getUserAgent(req),
        );

      return res.status(200).json({
        success: true,
        message:
          "Multi-factor authentication has been enabled. Please sign in again.",
        data: result,
      });
    } catch (error) {
      return this.handleError(
        res,
        error,
      );
    }
  }

  /**
   * Verify MFA during normal login.
   *
   * Successful verification creates the
   * authenticated session.
   */
  async verifyMfa(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const parsed =
      verifyMfaSchema.safeParse(
        req.body,
      );

    if (!parsed.success) {
      return sendValidationError(
        res,
        parsed.error,
      );
    }

    try {
      const result =
        await authService.verifyMfa(
          parsed.data.challengeId,
          parsed.data.token,
          getClientIp(req),
          getUserAgent(req),
        );

      this.setRefreshTokenCookie(
        res,
        result.tokens.refreshToken,
        result.tokens
          .refreshTokenExpiresAt,
      );

      return res.status(200).json({
        success: true,
        message:
          "Multi-factor authentication successful.",
        data: {
          user: result.user,
          accessToken:
            result.tokens.accessToken,
          accessTokenExpiresIn:
            result.tokens
              .accessTokenExpiresIn,
          session: result.session,
        },
      });
    } catch (error) {
      return this.handleError(
        res,
        error,
      );
    }
  }

  async refresh(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const refreshToken =
      getRefreshToken(req);

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    try {
      const result =
        await authService.refreshSession(
          refreshToken,
          getClientIp(req),
          getUserAgent(req),
        );

      this.setRefreshTokenCookie(
        res,
        result.refreshToken,
        result.refreshTokenExpiresAt,
      );

      return res.status(200).json({
        success: true,
        message: "Session refreshed.",
        data: {
          accessToken:
            result.accessToken,
          accessTokenExpiresIn:
            result.accessTokenExpiresIn,
          sessionId:
            result.sessionId,
        },
      });
    } catch {
      this.clearRefreshTokenCookie(
        res,
      );

      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }
  }

  async logout(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const refreshToken =
      getRefreshToken(req);

    if (refreshToken) {
      try {
        await authService.logout(
          refreshToken,
        );
      } catch {
        // Logout remains idempotent.
      }
    }

    this.clearRefreshTokenCookie(
      res,
    );

    return res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  }

  async logoutAll(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const userId =
      req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    try {
      await authService.logoutAll(
        userId,
      );

      this.clearRefreshTokenCookie(
        res,
      );

      return res.status(200).json({
        success: true,
        message:
          "All active sessions have been revoked.",
      });
    } catch (error) {
      return this.handleError(
        res,
        error,
      );
    }
  }

  async forgotPassword(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const parsed =
      forgotPasswordSchema.safeParse(
        req.body,
      );

    if (!parsed.success) {
      return sendValidationError(
        res,
        parsed.error,
      );
    }

    try {
      await authService.requestPasswordReset(
        parsed.data,
      );
    } catch {
      // Deliberately generic.
    }

    return res.status(200).json({
      success: true,
      message:
        "If an account exists for that email address, a password reset code has been sent.",
    });
  }

  async verifyPasswordResetOtp(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const parsed =
      verifyPasswordResetOtpSchema.safeParse(
        req.body,
      );

    if (!parsed.success) {
      return sendValidationError(
        res,
        parsed.error,
      );
    }

    try {
      const result =
        await authService.verifyPasswordResetOtp(
          parsed.data,
        );

      return res.status(200).json({
        success: true,
        message:
          "Verification successful. You can now reset your password.",
        data: {
          resetToken:
            result.resetToken,
        },
      });
    } catch (error) {
      return this.handleError(
        res,
        error,
      );
    }
  }

  async resetPassword(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const parsed =
      resetPasswordSchema.safeParse(
        req.body,
      );

    if (!parsed.success) {
      return sendValidationError(
        res,
        parsed.error,
      );
    }

    try {
      const result =
        await authService.resetPassword(
          parsed.data,
        );

      this.clearRefreshTokenCookie(
        res,
      );

      return res.status(200).json({
        success: true,
        message:
          "Password reset successfully. Please sign in again.",
        data: result,
      });
    } catch (error) {
      return this.handleError(
        res,
        error,
      );
    }
  }

  async changePassword(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const userId =
      req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    const parsed =
      changePasswordSchema.safeParse(
        req.body,
      );

    if (!parsed.success) {
      return sendValidationError(
        res,
        parsed.error,
      );
    }

    try {
      const result =
        await authService.changePassword({
          userId,
          ...parsed.data,
        });

      this.clearRefreshTokenCookie(
        res,
      );

      return res.status(200).json({
        success: true,
        message:
          "Password changed successfully. Please sign in again.",
        data: result,
      });
    } catch (error) {
      return this.handleError(
        res,
        error,
      );
    }
  }

  private setRefreshTokenCookie(
    res: Response,
    refreshToken: string,
    expiresAt: Date,
  ): void {
    res.cookie(
      env.sessionCookieName,
      refreshToken,
      {
        httpOnly: true,
        secure:
          env.nodeEnv === "production",
        sameSite: "lax",
        expires: expiresAt,
        path: "/api/v1/auth",
      },
    );
  }

  private clearRefreshTokenCookie(
    res: Response,
  ): void {
    res.clearCookie(
      env.sessionCookieName,
      {
        httpOnly: true,
        secure:
          env.nodeEnv === "production",
        sameSite: "lax",
        path: "/api/v1/auth",
      },
    );
  }

  private handleError(
    res: Response,
    error: unknown,
  ): Response {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred.";

    const knownClientMessages =
      new Set([
        "Unable to create account with these details.",
        "Invalid verification request.",
        "Invalid or expired verification code.",
        "Invalid or expired reset token.",
        "Invalid email or password.",
        "Account is temporarily locked. Please try again later.",
        "This account is not available for login.",
        "Please verify your email address before logging in.",
        "Invalid or expired session.",
        "Unable to refresh session.",
        "Invalid session.",
        "Passwords do not match.",
        "Unable to change password.",
        "Current password is incorrect.",
        "You cannot reuse a recent password.",
        "Unable to reset password.",
        "Invalid or expired MFA challenge.",
        "Invalid MFA code.",
        "MFA challenge is locked. Please start login again.",
        "Invalid or expired MFA setup challenge.",
        "MFA setup is not available for this account.",
        "MFA setup challenge is locked. Please start login again.",
      ]);

    if (
      knownClientMessages.has(message)
    ) {
      const statusCode =
        message ===
          "Invalid or expired session." ||
        message ===
          "Invalid or expired reset token." ||
        message ===
          "Invalid or expired MFA challenge." ||
        message ===
          "Invalid or expired MFA setup challenge."
          ? 401
          : 400;

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }

    console.error(
      "Authentication error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "An unexpected authentication error occurred.",
    });
  }
}

export const authController =
  new AuthController();