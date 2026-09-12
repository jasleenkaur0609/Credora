import argon2 from "argon2";
import { securityConfig } from "../../config/security.js";

export class PasswordService {
  /**
   * Hash a password using Argon2id.
   *
   * Argon2id is intentionally configured for password hashing,
   * not general-purpose cryptographic hashing.
   */
  async hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: securityConfig.password.argon2.memoryCost,
      timeCost: securityConfig.password.argon2.timeCost,
      parallelism: securityConfig.password.argon2.parallelism,
    });
  }

  /**
   * Verify a plain-text password against an Argon2id hash.
   */
  async verify(
    passwordHash: string,
    password: string,
  ): Promise<boolean> {
    try {
      return await argon2.verify(passwordHash, password);
    } catch {
      return false;
    }
  }

  /**
   * Validate the application's password policy.
   *
   * This performs policy validation only.
   * Password hashing is handled separately by hash().
   */
  validatePassword(password: string): void {
    const {
      minimumLength,
      maximumLength,
    } = securityConfig.password;

    if (password.length < minimumLength) {
      throw new Error(
        `Password must be at least ${minimumLength} characters long.`,
      );
    }

    if (password.length > maximumLength) {
      throw new Error(
        `Password must not exceed ${maximumLength} characters.`,
      );
    }

    if (!/[a-z]/.test(password)) {
      throw new Error(
        "Password must contain at least one lowercase letter.",
      );
    }

    if (!/[A-Z]/.test(password)) {
      throw new Error(
        "Password must contain at least one uppercase letter.",
      );
    }

    if (!/[0-9]/.test(password)) {
      throw new Error(
        "Password must contain at least one number.",
      );
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      throw new Error(
        "Password must contain at least one special character.",
      );
    }
  }

  /**
   * Check whether a password matches any previous password hash.
   *
   * Returns true when the password has already been used.
   */
  async isPasswordReused(
    password: string,
    passwordHashes: string[],
  ): Promise<boolean> {
    for (const passwordHash of passwordHashes) {
      const matches = await this.verify(passwordHash, password);

      if (matches) {
        return true;
      }
    }

    return false;
  }
}

export const passwordService = new PasswordService();