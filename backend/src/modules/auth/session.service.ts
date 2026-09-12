import { prisma } from "../../database/prisma.js";
import { tokenService } from "./token.service.js";

export interface CreateSessionInput {
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
}

export interface CreatedSession {
  sessionId: string;
  refreshToken: string;
  expiresAt: Date;
}

export class SessionService {
  /**
   * Create a new authenticated session.
   *
   * The raw refresh token is returned to the authentication layer.
   * Only its SHA-256 hash is persisted.
   */
  async createSession(
    input: CreateSessionInput,
  ): Promise<CreatedSession> {
    const refreshToken = tokenService.generateRefreshToken();
    const refreshTokenHash =
      tokenService.hashToken(refreshToken);

    const session = await prisma.session.create({
      data: {
        userId: input.userId,
        refreshTokenHash,
        expiresAt: input.expiresAt,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
    });

    return {
      sessionId: session.id,
      refreshToken,
      expiresAt: session.expiresAt,
    };
  }

  /**
   * Find an active session using the raw refresh token.
   *
   * The database is queried using the token hash.
   */
  async findActiveSession(refreshToken: string) {
    const refreshTokenHash =
      tokenService.hashToken(refreshToken);

    const session = await prisma.session.findUnique({
      where: {
        refreshTokenHash,
      },
      include: {
        user: {
          include: {
            roles: {
              include: {
                role: {
                  include: {
                    permissions: {
                      include: {
                        permission: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!session) {
      return null;
    }

    if (session.status !== "ACTIVE") {
      return null;
    }

    if (session.expiresAt <= new Date()) {
      await prisma.session.update({
        where: {
          id: session.id,
        },
        data: {
          status: "EXPIRED",
        },
      });

      return null;
    }

    return session;
  }

  /**
   * Rotate a refresh token.
   *
   * The previous session token becomes unusable and a new
   * refresh token is generated.
   */
  async rotateSession(
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<CreatedSession | null> {
    const session =
      await this.findActiveSession(refreshToken);

    if (!session) {
      return null;
    }

    const newRefreshToken =
      tokenService.generateRefreshToken();

    const newRefreshTokenHash =
      tokenService.hashToken(newRefreshToken);

    const updatedSession = await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        refreshTokenHash: newRefreshTokenHash,
        lastUsedAt: new Date(),
        ipAddress,
        userAgent,
      },
    });

    return {
      sessionId: updatedSession.id,
      refreshToken: newRefreshToken,
      expiresAt: updatedSession.expiresAt,
    };
  }

  /**
   * Update session activity.
   */
  async touchSession(sessionId: string): Promise<void> {
    await prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        lastUsedAt: new Date(),
      },
    });
  }

  /**
   * Revoke one session.
   */
  async revokeSession(sessionId: string): Promise<void> {
    await prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        status: "REVOKED",
        revokedAt: new Date(),
      },
    });
  }

  /**
   * Revoke the session represented by a refresh token.
   */
  async revokeByRefreshToken(
    refreshToken: string,
  ): Promise<boolean> {
    const refreshTokenHash =
      tokenService.hashToken(refreshToken);

    const session = await prisma.session.findUnique({
      where: {
        refreshTokenHash,
      },
    });

    if (!session) {
      return false;
    }

    await this.revokeSession(session.id);

    return true;
  }

  /**
   * Revoke all active sessions belonging to a user.
   *
   * Useful after password reset, password change, account
   * compromise, or "logout from all devices".
   */
  async revokeAllUserSessions(
    userId: string,
  ): Promise<number> {
    const result = await prisma.session.updateMany({
      where: {
        userId,
        status: "ACTIVE",
      },
      data: {
        status: "REVOKED",
        revokedAt: new Date(),
      },
    });

    return result.count;
  }

  /**
   * Mark expired sessions as expired.
   */
  async expireSessions(): Promise<number> {
    const result = await prisma.session.updateMany({
      where: {
        status: "ACTIVE",
        expiresAt: {
          lte: new Date(),
        },
      },
      data: {
        status: "EXPIRED",
      },
    });

    return result.count;
  }
}

export const sessionService = new SessionService();