import type { RoleType, UserStatus } from "../../../generated/prisma/client.js";

export interface AuthenticatedPermission {
  id: string;
  code: string;
  module: string;
  action: string;
  description: string | null;
}

export interface AuthenticatedRole {
  id: string;
  code: string;
  name: string;
  type: RoleType;
  permissions: AuthenticatedPermission[];
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
  isEmailVerified: boolean;
  mustResetPassword: boolean;
  roles: AuthenticatedRole[];
}

export interface SessionInfo {
  sessionId: string;
  expiresAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresAt: Date;
}

export interface RegisterResult {
  userId: string;
  email: string;
  status: UserStatus;
  emailVerificationRequired: boolean;
  mustResetPassword: boolean;
}

export interface VerifyEmailResult {
  userId: string;
  email: string;
  emailVerified: boolean;
  status: UserStatus;
}

export interface LoginResult {
  user: AuthenticatedUser;
  tokens: AuthTokens;
  session: SessionInfo;
}

export interface RefreshTokenResult {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresAt: Date;
  sessionId: string;
}

export interface LogoutResult {
  success: boolean;
}

export interface PasswordResetRequestResult {
  success: boolean;
}

export interface PasswordResetResult {
  success: boolean;
}

export interface ChangePasswordResult {
  success: boolean;
}

export interface OtpGenerationResult {
  expiresAt: Date;
}

export interface OtpVerificationResult {
  verified: boolean;
}

export interface AuthenticatedRequestContext {
  userId: string;
  sessionId: string;
  user: AuthenticatedUser;
}