import { apiClient, type ApiResponse } from "./api-client";

export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
}

export interface RegisterData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  mustResetPassword: boolean;
  emailVerificationRequired: boolean;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface VerifyEmailData {
  success: boolean;
  emailVerified: boolean;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginData {
  accessToken: string;
  accessTokenExpiresIn: string;
  sessionId: string;
  user: AuthUser;
}

export interface RefreshTokenData {
  accessToken: string;
  accessTokenExpiresIn: string;
  sessionId: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  isEmailVerified: boolean;
  mustResetPassword: boolean;
  roles: AuthRole[];
  permissions: AuthPermission[];
}

export interface AuthRole {
  id: string;
  name: string;
  type: string;
}

export interface AuthPermission {
  id: string;
  name: string;
  module: string;
  action: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyPasswordResetOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyPasswordResetOtpData {
  resetToken: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface LogoutData {
  success: boolean;
}

export interface PasswordResetData {
  success: boolean;
}

export interface ChangePasswordData {
  success: boolean;
}

export const authService = {
  async register(
    payload: RegisterRequest,
  ): Promise<ApiResponse<RegisterData>> {
    return apiClient.post<ApiResponse<RegisterData>>(
      "/auth/register",
      payload,
    );
  },

  async verifyEmail(
    payload: VerifyEmailRequest,
  ): Promise<ApiResponse<VerifyEmailData>> {
    return apiClient.post<ApiResponse<VerifyEmailData>>(
      "/auth/verify-email",
      payload,
    );
  },

  async resendVerification(
    payload: ResendVerificationRequest,
  ): Promise<ApiResponse<unknown>> {
    return apiClient.post<ApiResponse<unknown>>(
      "/auth/resend-verification",
      payload,
    );
  },

  async login(
    payload: LoginRequest,
  ): Promise<ApiResponse<LoginData>> {
    return apiClient.post<ApiResponse<LoginData>>(
      "/auth/login",
      payload,
    );
  },

  async refresh(): Promise<ApiResponse<RefreshTokenData>> {
    return apiClient.post<ApiResponse<RefreshTokenData>>(
      "/auth/refresh",
    );
  },

  async logout(): Promise<ApiResponse<LogoutData>> {
    return apiClient.post<ApiResponse<LogoutData>>(
      "/auth/logout",
    );
  },

  async logoutAll(): Promise<ApiResponse<LogoutData>> {
    return apiClient.post<ApiResponse<LogoutData>>(
      "/auth/logout-all",
    );
  },

  async forgotPassword(
    payload: ForgotPasswordRequest,
  ): Promise<ApiResponse<unknown>> {
    return apiClient.post<ApiResponse<unknown>>(
      "/auth/forgot-password",
      payload,
    );
  },

  async verifyPasswordResetOtp(
    payload: VerifyPasswordResetOtpRequest,
  ): Promise<ApiResponse<VerifyPasswordResetOtpData>> {
    return apiClient.post<ApiResponse<VerifyPasswordResetOtpData>>(
      "/auth/verify-password-reset-otp",
      payload,
    );
  },

  async resetPassword(
    payload: ResetPasswordRequest,
  ): Promise<ApiResponse<PasswordResetData>> {
    return apiClient.post<ApiResponse<PasswordResetData>>(
      "/auth/reset-password",
      payload,
    );
  },

  async changePassword(
    payload: ChangePasswordRequest,
    accessToken: string,
  ): Promise<ApiResponse<ChangePasswordData>> {
    return apiClient.post<ApiResponse<ChangePasswordData>>(
      "/auth/change-password",
      payload,
      {
        accessToken,
      },
    );
  },
};