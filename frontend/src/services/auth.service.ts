import { apiClient } from "./api-client";

import type {
  AuthenticatedUser,
  LoginResponse,
  MfaVerificationResponse,
} from "../types/auth";

/*
 * ----------------------------------------------------------
 * LOGIN
 * ----------------------------------------------------------
 */

export interface LoginPayload {
  email: string;
  password: string;
}

/*
 * ----------------------------------------------------------
 * MFA
 * ----------------------------------------------------------
 */

export interface MfaVerificationPayload {
  challengeId: string;
  token: string;
}

/*
 * ----------------------------------------------------------
 * AUTHENTICATED USER
 * ----------------------------------------------------------
 */

export type AuthUser = AuthenticatedUser;

/*
 * ----------------------------------------------------------
 * LOGIN DATA
 * ----------------------------------------------------------
 *
 * LoginData represents every possible response from the
 * backend login endpoint:
 *
 * 1. Temporary password reset required
 * 2. MFA setup required
 * 3. MFA verification required
 * 4. Fully authenticated
 */

export type LoginData = LoginResponse;

/*
 * ----------------------------------------------------------
 * API RESPONSE
 * ----------------------------------------------------------
 */

export interface AuthApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

/*
 * ----------------------------------------------------------
 * REFRESH SESSION
 * ----------------------------------------------------------
 */

export interface RefreshData {
  accessToken: string;
  refreshToken?: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresAt?: string;
  sessionId: string;
}

/*
 * ----------------------------------------------------------
 * AUTH SERVICE
 * ----------------------------------------------------------
 */

export const authService = {
  /*
   * ========================================================
   * LOGIN
   * ========================================================
   */

  async login(
    payload: LoginPayload,
  ): Promise<AuthApiResponse<LoginData>> {
    return apiClient.post<
      AuthApiResponse<LoginData>
    >(
      "/auth/login",
      payload,
    );
  },

  /*
   * ========================================================
   * VERIFY MFA
   * ========================================================
   *
   * Sends the short-lived MFA challenge ID and the user's
   * TOTP code to the backend.
   *
   * The backend creates the authenticated session only after
   * successful MFA verification.
   */

  async verifyMfa(
    payload: MfaVerificationPayload,
  ): Promise<
    AuthApiResponse<MfaVerificationResponse>
  > {
    return apiClient.post<
      AuthApiResponse<MfaVerificationResponse>
    >(
      "/auth/mfa/verify",
      payload,
    );
  },

  /*
   * ========================================================
   * REFRESH SESSION
   * ========================================================
   *
   * The refresh token is sent automatically through the
   * HttpOnly cookie because apiClient uses:
   *
   * credentials: "include"
   */

  async refresh(): Promise<
    AuthApiResponse<RefreshData>
  > {
    return apiClient.post<
      AuthApiResponse<RefreshData>
    >(
      "/auth/refresh",
    );
  },

  /*
   * ========================================================
   * LOGOUT
   * ========================================================
   */

  async logout(): Promise<
    AuthApiResponse<{
      success: boolean;
    }>
  > {
    return apiClient.post<
      AuthApiResponse<{
        success: boolean;
      }>
    >(
      "/auth/logout",
    );
  },

  /*
   * ========================================================
   * LOGOUT ALL SESSIONS
   * ========================================================
   */

  async logoutAll(): Promise<
    AuthApiResponse<{
      success: boolean;
    }>
  > {
    return apiClient.post<
      AuthApiResponse<{
        success: boolean;
      }>
    >(
      "/auth/logout-all",
    );
  },

  /*
   * ========================================================
   * CURRENT USER
   * ========================================================
   *
   * The backend /auth/me endpoint will be implemented as
   * part of the session restoration / protected-route work.
   */

  async getCurrentUser(
    accessToken: string,
  ): Promise<
    AuthApiResponse<{
      user: AuthenticatedUser;
    }>
  > {
    return apiClient.get<
      AuthApiResponse<{
        user: AuthenticatedUser;
      }>
    >(
      "/auth/me",
      {
        accessToken,
      },
    );
  },
};