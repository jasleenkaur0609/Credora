import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { jwtService } from "../modules/auth/jwt.service.js";
import { sessionService } from "../modules/auth/session.service.js";
import { authService } from "../modules/auth/auth.service.js";

function getBearerToken(
  req: Request,
): string | null {
  const authorization =
    req.get("authorization");

  if (!authorization) {
    return null;
  }

  const parts =
    authorization.trim().split(/\s+/);

  if (parts.length !== 2) {
    return null;
  }

  const [scheme, token] = parts;

  if (
    scheme?.toLowerCase() !== "bearer" ||
    !token
  ) {
    return null;
  }

  return token;
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const accessToken =
      getBearerToken(req);

    if (!accessToken) {
      res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });

      return;
    }

    /*
     * Step 1:
     * Cryptographically verify the access JWT.
     *
     * No database session is trusted until the JWT
     * signature, issuer, audience and expiry have passed.
     */
    const payload =
      jwtService.verifyAccessToken(
        accessToken,
      );

    if (!payload) {
      res.status(401).json({
        success: false,
        message:
          "Invalid or expired access token.",
      });

      return;
    }

    /*
     * Step 2:
     * Resolve the session using the session ID
     * embedded inside the verified access token.
     *
     * IMPORTANT:
     * Do NOT call findActiveSession(accessToken).
     * That method is specifically for refresh tokens.
     */
    const session =
      await sessionService.findActiveSessionById(
        payload.sessionId,
      );

    if (!session) {
      res.status(401).json({
        success: false,
        message:
          "Invalid or expired session.",
      });

      return;
    }

    /*
     * Step 3:
     * Prevent token/session identity mismatches.
     */
    if (
      session.userId !== payload.sub
    ) {
      res.status(401).json({
        success: false,
        message:
          "Invalid or expired session.",
      });

      return;
    }

    /*
     * Step 4:
     * Resolve the current user and current
     * roles/permissions from the database.
     *
     * Permissions are therefore not trusted from
     * the frontend or from the JWT.
     */
    const user =
      await authService.getAuthenticatedUser(
        payload.sub,
      );

    /*
     * Step 5:
     * Account status is checked server-side
     * on every protected request.
     */
    if (user.status !== "ACTIVE") {
      res.status(403).json({
        success: false,
        message:
          "Account is not active.",
      });

      return;
    }

    /*
     * Step 6:
     * Protected Credora access requires
     * verified email.
     */
    if (!user.isEmailVerified) {
      res.status(403).json({
        success: false,
        message:
          "Email verification is required.",
      });

      return;
    }

    /*
     * Step 7:
     * A user with a pending mandatory password
     * reset must not be treated as fully authenticated.
     */
    if (user.mustResetPassword) {
      res.status(403).json({
        success: false,
        message:
          "Password reset is required.",
      });

      return;
    }

    /*
     * Step 8:
     * Attach the authenticated context to the
     * Express request.
     */
    req.user = {
      userId: user.id,
      sessionId: session.id,
      user,
    };

    /*
     * Step 9:
     * Update session activity.
     */
    await sessionService.touchSession(
      session.id,
    );

    next();
  } catch (error) {
    console.error(
      "Authentication middleware error:",
      error,
    );

    res.status(401).json({
      success: false,
      message:
        "Authentication required.",
    });
  }
}