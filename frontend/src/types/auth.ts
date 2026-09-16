/*
 * ============================================================
 * CREDORA AUTHENTICATION TYPES
 * ============================================================
 *
 * Shared frontend types for:
 *
 * - Authentication
 * - User identity
 * - Roles
 * - Permissions
 * - Sessions
 * - Access tokens
 * - MFA
 * - Password reset
 * - Authentication flow state
 *
 * These types mirror the authentication responses
 * expected from the Credora backend.
 *
 * ============================================================
 */


/*
 * ------------------------------------------------------------
 * USER STATUS
 * ------------------------------------------------------------
 */

export type UserStatus =
  | "PENDING"
  | "ACTIVE"
  | "LOCKED"
  | "SUSPENDED"
  | "DISABLED";


/*
 * ------------------------------------------------------------
 * ROLE TYPE
 * ------------------------------------------------------------
 */

export type RoleType =
  | "SYSTEM"
  | "CUSTOM";


/*
 * ------------------------------------------------------------
 * PERMISSION
 * ------------------------------------------------------------
 */

export interface AuthenticatedPermission {
  id: string;

  code: string;

  module: string;

  action: string;

  description: string | null;
}


/*
 * ------------------------------------------------------------
 * ROLE
 * ------------------------------------------------------------
 */

export interface AuthenticatedRole {
  id: string;

  code: string;

  name: string;

  type: RoleType;

  permissions: AuthenticatedPermission[];
}


/*
 * ------------------------------------------------------------
 * AUTHENTICATED USER
 * ------------------------------------------------------------
 */

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


/*
 * ------------------------------------------------------------
 * SESSION
 * ------------------------------------------------------------
 */

export interface SessionInfo {
  sessionId: string;

  expiresAt: string;
}


/*
 * ------------------------------------------------------------
 * AUTH TOKENS
 * ------------------------------------------------------------
 *
 * The refresh token should normally remain inside the
 * backend-managed HttpOnly cookie.
 *
 * Therefore refreshToken is optional here.
 */

export interface AuthTokens {
  accessToken: string;

  refreshToken?: string;

  accessTokenExpiresIn: string;

  refreshTokenExpiresAt?: string;
}


/*
 * ------------------------------------------------------------
 * TEMPORARY PASSWORD LOGIN
 * ------------------------------------------------------------
 *
 * Returned when the user successfully authenticates using
 * the temporary password generated during registration.
 *
 * No authenticated session is created at this stage.
 */

export interface TemporaryPasswordLoginResult {
  requiresPasswordReset: true;

  resetToken: string;

  expiresAt: string;
}


/*
 * ------------------------------------------------------------
 * MFA LOGIN CHALLENGE
 * ------------------------------------------------------------
 *
 * Returned when:
 *
 * Email + password
 *        ↓
 * Credentials verified
 *        ↓
 * MFA required
 *
 * No authenticated session exists yet.
 */

export interface LoginMfaChallengeResult {
  requiresMfa: true;

  challengeId: string;

  expiresAt: string;
}


/*
 * ------------------------------------------------------------
 * MFA SETUP REQUIRED
 * ------------------------------------------------------------
 *
 * Returned when the user's credentials are valid but
 * TOTP MFA has not been configured yet.
 *
 * No authenticated session exists yet.
 */

export interface LoginMfaSetupRequiredResult {
  requiresMfaSetup: true;

  setupChallengeId: string;

  expiresAt: string;
}


/*
 * ------------------------------------------------------------
 * FULL LOGIN SUCCESS
 * ------------------------------------------------------------
 *
 * This response means the authentication process is complete.
 *
 * The user has:
 *
 * - authenticated identity
 * - access token
 * - authenticated session
 *
 * For MFA-enabled users this is returned ONLY after
 * successful MFA verification.
 */

export interface LoginSuccess {
  user: AuthenticatedUser;

  tokens: AuthTokens;

  session: SessionInfo;
}


/*
 * ------------------------------------------------------------
 * LOGIN RESPONSE
 * ------------------------------------------------------------
 *
 * The backend can return one of these states:
 *
 * 1. Temporary password → password reset required
 * 2. MFA setup required
 * 3. MFA verification required
 * 4. Fully authenticated
 */

export type LoginResponse =
  | TemporaryPasswordLoginResult
  | LoginMfaSetupRequiredResult
  | LoginMfaChallengeResult
  | LoginSuccess;


/*
 * ------------------------------------------------------------
 * MFA VERIFICATION RESPONSE
 * ------------------------------------------------------------
 *
 * Returned after successful verification of the TOTP code.
 *
 * This is a fully authenticated response.
 */

export interface MfaVerificationResponse {
  user: AuthenticatedUser;

  tokens: AuthTokens;

  session: SessionInfo;
}


/*
 * ------------------------------------------------------------
 * MFA SETUP RESPONSE
 * ------------------------------------------------------------
 *
 * Returned while configuring TOTP for the first time.
 *
 * IMPORTANT:
 * The secret and QR data must NOT be persisted to
 * localStorage or exposed in logs.
 */

export interface MfaSetupResponse {
  challengeId: string;

  method: "TOTP";

  secret: string;

  otpauthUrl: string;

  qrCodeDataUrl: string;

  expiresAt: string;
}


/*
 * ------------------------------------------------------------
 * MFA SETUP VERIFICATION RESPONSE
 * ------------------------------------------------------------
 */

export interface MfaSetupVerificationResponse {
  success: boolean;

  enabled: boolean;
}


/*
 * ------------------------------------------------------------
 * REFRESH TOKEN RESPONSE
 * ------------------------------------------------------------
 */

export interface RefreshTokenResponse {
  accessToken: string;

  refreshToken?: string;

  accessTokenExpiresIn: string;

  refreshTokenExpiresAt?: string;

  sessionId: string;
}


/*
 * ------------------------------------------------------------
 * LOGOUT RESPONSE
 * ------------------------------------------------------------
 */

export interface LogoutResponse {
  success: boolean;
}


/*
 * ------------------------------------------------------------
 * PASSWORD RESET
 * ------------------------------------------------------------
 */

export interface PasswordResetRequestResponse {
  success: boolean;
}


export interface PasswordResetResponse {
  success: boolean;
}


/*
 * ------------------------------------------------------------
 * PASSWORD CHANGE
 * ------------------------------------------------------------
 */

export interface ChangePasswordResponse {
  success: boolean;
}


/*
 * ------------------------------------------------------------
 * AUTHENTICATION FLOW STATE
 * ------------------------------------------------------------
 */

export type AuthFlowState =
  | "IDLE"
  | "AUTHENTICATING"
  | "MFA_REQUIRED"
  | "MFA_SETUP_REQUIRED"
  | "AUTHENTICATED"
  | "ERROR";