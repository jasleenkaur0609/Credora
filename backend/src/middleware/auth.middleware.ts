import type { NextFunction, Request, Response } from "express";
import { jwtService } from "../modules/auth/jwt.service.js";
import { sessionService } from "../modules/auth/session.service.js";
import { authService } from "../modules/auth/auth.service.js";

function getBearerToken(req: Request): string | null {
  const authorization = req.get("authorization");

  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token.trim();
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = getBearerToken(req);

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });

      return;
    }

    const payload = jwtService.verifyAccessToken(token);

    if (!payload) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired access token.",
      });

      return;
    }

    const session = await sessionService.findActiveSession(
      token,
    );

    /*
     * The access-token payload identifies the session,
     * while the database determines whether that session
     * is still active.
     */
    if (
      !session ||
      session.id !== payload.sessionId ||
      session.userId !== payload.sub
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired session.",
      });

      return;
    }

    const user = await authService.getAuthenticatedUser(
      payload.sub,
    );

    /*
     * Account status is checked server-side on every
     * protected request.
     */
    if (
      user.status !== "ACTIVE"
    ) {
      res.status(403).json({
        success: false,
        message: "Account is not active.",
      });

      return;
    }

    if (!user.isEmailVerified) {
      res.status(403).json({
        success: false,
        message: "Email verification is required.",
      });

      return;
    }

    req.user = {
      userId: user.id,
      sessionId: session.id,
      user,
    };

    await sessionService.touchSession(session.id);

    next();
  } catch (error) {
    console.error(
      "Authentication middleware error:",
      error,
    );

    res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }
}