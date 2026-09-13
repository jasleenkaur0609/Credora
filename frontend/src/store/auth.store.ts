import { create } from "zustand";
import {
  authService,
  type AuthUser,
  type LoginData,
} from "../services/auth.service";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  sessionId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuthentication: (data: LoginData) => void;
  clearAuthentication: () => void;

  login: (
    email: string,
    password: string,
  ) => Promise<LoginData>;

  refreshSession: () => Promise<boolean>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  sessionId: null,
  isAuthenticated: false,
  isLoading: false,

  setAuthentication: (data) => {
    set({
      user: data.user,
      accessToken: data.accessToken,
      sessionId: data.sessionId,
      isAuthenticated: true,
    });
  },

  clearAuthentication: () => {
    set({
      user: null,
      accessToken: null,
      sessionId: null,
      isAuthenticated: false,
    });
  },

  login: async (email, password) => {
    set({ isLoading: true });

    try {
      const response = await authService.login({
        email,
        password,
      });

      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Unable to sign in.",
        );
      }

      const loginData = response.data;

      get().setAuthentication(loginData);

      return loginData;
    } finally {
      set({ isLoading: false });
    }
  },

  refreshSession: async () => {
    set({ isLoading: true });

    try {
      const response = await authService.refresh();

      if (!response.success || !response.data) {
        get().clearAuthentication();
        return false;
      }

      const { accessToken, accessTokenExpiresIn, sessionId } =
        response.data;

      const currentUser = get().user;

      if (!currentUser) {
        get().clearAuthentication();
        return false;
      }

      set({
        accessToken,
        sessionId,
        isAuthenticated: true,
      });

      void accessTokenExpiresIn;

      return true;
    } catch {
      get().clearAuthentication();
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });

    try {
      await authService.logout();
    } finally {
      get().clearAuthentication();
      set({ isLoading: false });
    }
  },

  logoutAll: async () => {
    set({ isLoading: true });

    try {
      const accessToken = get().accessToken;

      if (!accessToken) {
        get().clearAuthentication();
        return;
      }

      await authService.logoutAll();
    } finally {
      get().clearAuthentication();
      set({ isLoading: false });
    }
  },
}));