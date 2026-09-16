import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";
import { authController } from "./auth.controller.js";

const router = Router();

/**
 * Public authentication routes.
 */

router.post(
  "/register",
  authController.register,
);

router.post(
  "/verify-email",
  authController.verifyEmail,
);

router.post(
  "/resend-verification",
  authController.resendVerification,
);

/**
 * Password authentication stage.
 */
router.post(
  "/login",
  authController.login,
);

/**
 * MFA enrollment.
 *
 * These endpoints use a short-lived SETUP challenge.
 * They do NOT require a normal authenticated session.
 */
router.post(
  "/mfa/setup",
  authController.setupMfa,
);

router.post(
  "/mfa/setup/verify",
  authController.verifyMfaSetup,
);

/**
 * MFA login verification.
 *
 * This endpoint creates the full authenticated
 * session only after successful TOTP verification.
 */
router.post(
  "/mfa/verify",
  authController.verifyMfa,
);

router.post(
  "/refresh",
  authController.refresh,
);

router.post(
  "/logout",
  authController.logout,
);

/**
 * Password recovery.
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
 * Protected authentication routes.
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