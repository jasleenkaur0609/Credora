import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Please enter a valid email address.")
  .max(320, "Email address is too long.");

const passwordSchema = z
  .string()
  .min(
    12,
    "Password must be at least 12 characters long.",
  )
  .max(
    128,
    "Password must not exceed 128 characters.",
  )
  .regex(
    /[a-z]/,
    "Password must contain at least one lowercase letter.",
  )
  .regex(
    /[A-Z]/,
    "Password must contain at least one uppercase letter.",
  )
  .regex(
    /[0-9]/,
    "Password must contain at least one number.",
  )
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character.",
  );

const otpSchema = z
  .string()
  .trim()
  .regex(
    /^\d{6}$/,
    "OTP must be a 6-digit code.",
  );

const challengeIdSchema = z
  .string()
  .uuid("Invalid MFA challenge ID.");

const nameSchema = z
  .string()
  .trim()
  .min(1, "This field is required.")
  .max(
    100,
    "This field must not exceed 100 characters.",
  )
  .regex(
    /^[\p{L}\p{M}' -]+$/u,
    "This field contains invalid characters.",
  );

/**
 * User registration.
 *
 * Role assignment is intentionally excluded.
 */
export const registerSchema = z
  .object({
    email: emailSchema,
    firstName: nameSchema,
    lastName: nameSchema,
  })
  .strict();

/**
 * Login.
 */
export const loginSchema = z
  .object({
    email: emailSchema,

    password: z
      .string()
      .min(1, "Password is required.")
      .max(
        128,
        "Password is too long.",
      ),
  })
  .strict();

/**
 * Email verification OTP.
 */
export const verifyEmailOtpSchema = z
  .object({
    email: emailSchema,
    otp: otpSchema,
  })
  .strict();

/**
 * Resend email verification OTP.
 */
export const resendEmailVerificationSchema = z
  .object({
    email: emailSchema,
  })
  .strict();

/**
 * Forgot password.
 */
export const forgotPasswordSchema = z
  .object({
    email: emailSchema,
  })
  .strict();

/**
 * Password reset OTP verification.
 */
export const verifyPasswordResetOtpSchema = z
  .object({
    email: emailSchema,
    otp: otpSchema,
  })
  .strict();

/**
 * Password reset.
 */
export const resetPasswordSchema = z
  .object({
    token: z
      .string()
      .trim()
      .min(
        1,
        "Reset token is required.",
      )
      .max(
        512,
        "Reset token is too long.",
      ),

    password: passwordSchema,

    confirmPassword: z
      .string()
      .min(
        1,
        "Please confirm your password.",
      )
      .max(
        128,
        "Password is too long.",
      ),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (
      data.password !==
      data.confirmPassword
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message:
          "Passwords do not match.",
      });
    }
  });

/**
 * Change password.
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(
        1,
        "Current password is required.",
      )
      .max(
        128,
        "Password is too long.",
      ),

    newPassword: passwordSchema,

    confirmPassword: z
      .string()
      .min(
        1,
        "Please confirm your password.",
      )
      .max(
        128,
        "Password is too long.",
      ),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (
      data.currentPassword ===
      data.newPassword
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["newPassword"],
        message:
          "New password must be different from the current password.",
      });
    }

    if (
      data.newPassword !==
      data.confirmPassword
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message:
          "Passwords do not match.",
      });
    }
  });

/**
 * Login verification OTP.
 */
export const verifyLoginOtpSchema = z
  .object({
    otp: otpSchema,
  })
  .strict();

/**
 * Generic OTP verification.
 */
export const verifyOtpSchema = z
  .object({
    otp: otpSchema,
  })
  .strict();

/**
 * MFA login verification.
 */
export const verifyMfaSchema = z
  .object({
    challengeId: challengeIdSchema,
    token: otpSchema,
  })
  .strict();

/**
 * MFA setup initialization.
 *
 * The challenge must have been returned by the
 * password-authentication stage.
 */
export const mfaSetupSchema = z
  .object({
    challengeId: challengeIdSchema,
  })
  .strict();

/**
 * MFA setup verification.
 */
export const verifyMfaSetupSchema = z
  .object({
    challengeId: challengeIdSchema,
    token: otpSchema,
  })
  .strict();

export type RegisterInput =
  z.infer<typeof registerSchema>;

export type LoginInput =
  z.infer<typeof loginSchema>;

export type VerifyEmailOtpInput =
  z.infer<typeof verifyEmailOtpSchema>;

export type ResendEmailVerificationInput =
  z.infer<
    typeof resendEmailVerificationSchema
  >;

export type ForgotPasswordInput =
  z.infer<typeof forgotPasswordSchema>;

export type VerifyPasswordResetOtpInput =
  z.infer<
    typeof verifyPasswordResetOtpSchema
  >;

export type ResetPasswordInput =
  z.infer<typeof resetPasswordSchema>;

export type ChangePasswordInput =
  z.infer<typeof changePasswordSchema>;

export type VerifyLoginOtpInput =
  z.infer<typeof verifyLoginOtpSchema>;

export type VerifyOtpInput =
  z.infer<typeof verifyOtpSchema>;

export type VerifyMfaInput =
  z.infer<typeof verifyMfaSchema>;

export type MfaSetupInput =
  z.infer<typeof mfaSetupSchema>;

export type VerifyMfaSetupInput =
  z.infer<typeof verifyMfaSetupSchema>;