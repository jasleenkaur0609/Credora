import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";
import { authController } from "./auth.controller.js";

const router = Router();

/**
 * Public authentication routes
 *
 * These endpoints do not require a fully authenticated session.
 */

/**
 * Registration
 */
router.post(
  "/register",
  authController.register,
);

/**
 * Email verification
 */
router.post(
  "/verify-email",
  authController.verifyEmail,
);

router.post(
  "/resend-verification",
  authController.resendVerification,
);

/**
 * Login
 *
 * Password verification happens first.
 *
 * Depending on the user's security state, this can return:
 *
 * 1. MFA setup required
 * 2. MFA challenge required
 * 3. Fully authenticated session
 */
router.post(
  "/login",
  authController.login,
);

/**
 * MFA verification
 *
 * This is intentionally PUBLIC because the user does not
 * have a fully authenticated session yet.
 *
 * The MFA challenge ID is the short-lived pre-authentication
 * credential created by /login.
 */
router.post(
  "/mfa/verify",
  authController.verifyMfa,
);

/**
 * Token refresh
 */
router.post(
  "/refresh",
  authController.refresh,
);

/**
 * Logout
 */
router.post(
  "/logout",
  authController.logout,
);

/**
 * Password recovery
 */
router.post(
  "/forgot-password",
  authController.forgotPassword,
);

router.post(
  "/verify-password-reset-otp",
  authController.verifyPasswordResetOtp,
);

router.post(
  "/reset-password",
  authController.resetPassword,
);

/**
 * Protected authentication routes
 *
 * These require a fully authenticated session.
 */
router.post(
  "/logout-all",
  authenticate,
  authController.logoutAll,
);

router.post(
  "/change-password",
  authenticate,
  authController.changePassword,
);

export default router;