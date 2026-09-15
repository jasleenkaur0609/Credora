import type { Request, Response } from "express";

import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendEmailVerificationSchema,
  resetPasswordSchema,
  verifyEmailOtpSchema,
  verifyMfaSchema,
  verifyPasswordResetOtpSchema,
} from "./auth.validation.js";

import { authService } from "./auth.service.js";

function getClientIp(
  req: Request,
): string | undefined {
  const forwardedFor =
    req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string") {
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
  return req.get("user-agent") ?? undefined;
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
  return req.cookies?.credora_refresh_token;
}

export class AuthController {
  /**
   * Bind controller methods once so Express
   * always invokes them with the correct
   * AuthController context.
   */
  constructor() {
    this.register =
      this.register.bind(this);

    this.verifyEmail =
      this.verifyEmail.bind(this);

    this.resendVerification =
      this.resendVerification.bind(this);

    this.login =
      this.login.bind(this);

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
      this.verifyPasswordResetOtp.bind(this);

    this.resetPassword =
      this.resetPassword.bind(this);

    this.changePassword =
      this.changePassword.bind(this);
  }

  /**
   * POST /api/v1/auth/register
   */
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

  /**
   * POST /api/v1/auth/verify-email
   */
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

  /**
   * POST /api/v1/auth/resend-verification
   */
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
   * POST /api/v1/auth/login
   *
   * Password verification happens first.
   *
   * Depending on the account's MFA state,
   * this endpoint can return:
   *
   * 1. MFA setup required
   * 2. MFA verification required
   *
   * A fully authenticated session is only created
   * after successful MFA verification.
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
       * MFA enrollment is required.
       *
       * No access token or refresh token is issued.
       */
      if ("requiresMfaSetup" in result) {
        return res.status(200).json({
          success: true,
          message:
            "Multi-factor authentication setup is required.",
          data: {
            requiresMfaSetup: true,
            userId: result.userId,
          },
        });
      }

      /**
       * Password authentication succeeded,
       * but MFA has not yet been completed.
       *
       * No authenticated session exists at this point.
       */
      if ("requiresMfa" in result) {
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
       * This branch represents a fully authenticated
       * login response.
       *
       * The refresh-token cookie is created only here.
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
   * POST /api/v1/auth/mfa/verify
   *
   * This endpoint is intentionally public because
   * the user does not have a fully authenticated
   * session yet.
   *
   * The MFA challenge is the short-lived
   * pre-authentication credential created during login.
   *
   * Successful verification creates the actual
   * authenticated session and refresh-token cookie.
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

      /**
       * The refresh token is issued only after
       * successful MFA verification.
       */
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

  /**
   * POST /api/v1/auth/refresh
   */
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

  /**
   * POST /api/v1/auth/logout
   */
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
        /**
         * Logout remains idempotent.
         * The browser cookie is still cleared.
         */
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

  /**
   * POST /api/v1/auth/logout-all
   *
   * Requires authentication middleware.
   */
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

  /**
   * POST /api/v1/auth/forgot-password
   */
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

      /**
       * Always return the same response
       * to prevent account enumeration.
       */
      return res.status(200).json({
        success: true,
        message:
          "If an account exists for that email address, a password reset code has been sent.",
      });
    } catch {
      /**
       * Do not reveal whether the account
       * exists or whether email delivery failed.
       */
      return res.status(200).json({
        success: true,
        message:
          "If an account exists for that email address, a password reset code has been sent.",
      });
    }
  }

  /**
   * POST /api/v1/auth/verify-password-reset-otp
   *
   * Verifies the PASSWORD_RESET OTP and
   * returns a short-lived reset token.
   */
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

  /**
   * POST /api/v1/auth/reset-password
   */
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

      /**
       * Resetting the password revokes
       * existing sessions.
       */
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

  /**
   * POST /api/v1/auth/change-password
   *
   * Requires authentication middleware.
   */
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

      /**
       * Password change revokes
       * existing sessions.
       */
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

  /**
   * Set the secure refresh-token cookie.
   */
  private setRefreshTokenCookie(
    res: Response,
    refreshToken: string,
    expiresAt: Date,
  ): void {
    res.cookie(
      "credora_refresh_token",
      refreshToken,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "lax",
        expires: expiresAt,
        path: "/api/v1/auth",
      },
    );
  }

  /**
   * Clear the refresh-token cookie.
   */
  private clearRefreshTokenCookie(
    res: Response,
  ): void {
    res.clearCookie(
      "credora_refresh_token",
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "lax",
        path: "/api/v1/auth",
      },
    );
  }

  /**
   * Convert known authentication
   * failures into safe API responses.
   *
   * Internal errors are never exposed
   * to the client.
   */
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
        "Password reset completion requires the verified reset flow.",
        "Invalid or expired MFA challenge.",
        "Invalid MFA code.",
        "MFA challenge is locked. Please start login again.",
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
          "Invalid or expired MFA challenge."
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