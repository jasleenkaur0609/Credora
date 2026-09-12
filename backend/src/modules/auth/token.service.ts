import { createHash, randomBytes } from "node:crypto";

export class TokenService {
  /**
   * Generate a cryptographically secure random token.
   *
   * The raw token is returned only to the caller.
   * Only its hash should ever be persisted.
   */
  generateRandomToken(byteLength = 32): string {
    return randomBytes(byteLength).toString("hex");
  }

  /**
   * Hash a token before storing it in the database.
   */
  hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  /**
   * Generate an access-token identifier.
   *
   * The actual signed access-token implementation will be added
   * when the authentication service is connected to the session layer.
   */
  generateAccessTokenId(): string {
    return randomBytes(32).toString("hex");
  }

  /**
   * Generate a refresh token.
   *
   * The raw value is returned to the authentication layer.
   * The database should receive only hashToken(refreshToken).
   */
  generateRefreshToken(): string {
    return this.generateRandomToken(64);
  }

  /**
   * Create a password-reset token.
   *
   * Only the hash should be stored in PostgreSQL.
   */
  generatePasswordResetToken(): string {
    return this.generateRandomToken(32);
  }

  /**
   * Create a cryptographically secure invitation token.
   */
  generateInvitationToken(): string {
    return this.generateRandomToken(32);
  }
}

export const tokenService = new TokenService();