import { Router } from "express";
import { authController } from "./auth.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

/**
 * Public authentication routes
 */

// Registration
router.post(
  "/register",
  authController.register,
);

// Email verification
router.post(
  "/verify-email",
  authController.verifyEmail,
);

// Resend email verification OTP
router.post(
  "/resend-verification",
  authController.resendVerification,
);

// Login
router.post(
  "/login",
  authController.login,
);

// Refresh access token
router.post(
  "/refresh",
  authController.refresh,
);

// Logout
router.post(
  "/logout",
  authController.logout,
);

// Forgot password
router.post(
  "/forgot-password",
  authController.forgotPassword,
);

// Verify password reset OTP
router.post(
  "/verify-password-reset-otp",
  authController.verifyPasswordResetOtp,
);

// Reset password
router.post(
  "/reset-password",
  authController.resetPassword,
);

/**
 * Protected authentication routes
 */

// Logout from all sessions
router.post(
  "/logout-all",
  authenticate,
  authController.logoutAll,
);

// Change password
router.post(
  "/change-password",
  authenticate,
  authController.changePassword,
);

export default router;