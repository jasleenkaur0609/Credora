import "dotenv/config";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getNumberEnv(name: string, defaultValue: number): number {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    return defaultValue;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Environment variable ${name} must be a valid number.`);
  }

  return parsed;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",

  port: getNumberEnv("PORT", 5000),

  databaseUrl: getRequiredEnv("DATABASE_URL"),

  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",

  jwtAccessSecret: getRequiredEnv("JWT_ACCESS_SECRET"),
  jwtRefreshSecret: getRequiredEnv("JWT_REFRESH_SECRET"),

  accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
  refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",

  sessionCookieName:
    process.env.SESSION_COOKIE_NAME ?? "credora_refresh_token",

  smtpHost: process.env.SMTP_HOST ?? "",
  smtpPort: getNumberEnv("SMTP_PORT", 587),
  smtpUser: process.env.SMTP_USER ?? "",
  smtpPassword: process.env.SMTP_PASSWORD ?? "",
  smtpFrom: process.env.SMTP_FROM ?? "",

  otpExpiryMinutes: getNumberEnv("OTP_EXPIRY_MINUTES", 5),
  otpMaxAttempts: getNumberEnv("OTP_MAX_ATTEMPTS", 5),
  otpResendCooldownSeconds: getNumberEnv(
    "OTP_RESEND_COOLDOWN_SECONDS",
    60,
  ),

  passwordResetExpiryMinutes: getNumberEnv(
    "PASSWORD_RESET_EXPIRY_MINUTES",
    15,
  ),
} as const;