import jwt, {
  type JwtPayload,
  type SignOptions,
} from "jsonwebtoken";
import { env } from "../../config/env.js";

export interface AccessTokenPayload {
  sub: string;
  sessionId: string;
  type: "access";
}

export class JwtService {
  /**
   * Create a short-lived access token.
   *
   * Access tokens contain only identifiers and token type.
   * Sensitive user information and permissions are resolved
   * server-side.
   */
  generateAccessToken(
    userId: string,
    sessionId: string,
  ): string {
    const payload: AccessTokenPayload = {
      sub: userId,
      sessionId,
      type: "access",
    };

    const options: SignOptions = {
      expiresIn: env.accessTokenExpiresIn as SignOptions["expiresIn"],
      issuer: "credora-api",
      audience: "credora-client",
    };

    return jwt.sign(payload, env.jwtAccessSecret, options);
  }

  /**
   * Verify and decode an access token.
   */
  verifyAccessToken(
    token: string,
  ): AccessTokenPayload | null {
    try {
      const decoded = jwt.verify(
        token,
        env.jwtAccessSecret,
        {
          issuer: "credora-api",
          audience: "credora-client",
        },
      ) as JwtPayload & {
        sessionId?: string;
        type?: string;
      };

      if (
        typeof decoded.sub !== "string" ||
        typeof decoded.sessionId !== "string" ||
        decoded.type !== "access"
      ) {
        return null;
      }

      return {
        sub: decoded.sub,
        sessionId: decoded.sessionId,
        type: "access",
      };
    } catch {
      return null;
    }
  }
}

export const jwtService = new JwtService();