export const securityConfig = {
  password: {
    minimumLength: 12,
    maximumLength: 128,
    historyCount: 5,
    argon2: {
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    },
  },

  login: {
    maxFailedAttempts: 5,
    lockDurationMinutes: 15,
  },

  otp: {
    length: 6,
    expiryMinutes: 5,
    maxAttempts: 5,
    resendCooldownSeconds: 60,
  },

  session: {
    accessTokenMinutes: 15,
    refreshTokenDays: 7,
  },

  resetToken: {
    expiryMinutes: 15,
    byteLength: 32,
  },

  cookies: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
  },
} as const;