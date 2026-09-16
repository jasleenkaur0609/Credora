import { create } from "zustand";

import {
  authService,
  type LoginData,
} from "../services/auth.service";

import type {
  AuthenticatedUser,
  AuthFlowState,
  LoginSuccess,
} from "../types/auth";

/*
 * ============================================================
 * AUTH STATE
 * ============================================================
 */

interface AuthState {
  user: AuthenticatedUser | null;

  accessToken: string | null;

  sessionId: string | null;

  isAuthenticated: boolean;

  isLoading: boolean;

  authFlowState: AuthFlowState;

  mfaChallengeId: string | null;

  mfaSetupChallengeId: string | null;

  mfaExpiresAt: string | null;

  error: string | null;

  /*
   * Authentication
   */

  setAuthentication: (
    data: LoginSuccess,
  ) => void;

  /*
   * MFA
   */

  setMfaChallenge: (
    challengeId: string,
    expiresAt: string,
  ) => void;

  setMfaSetupChallenge: (
    challengeId: string,
    expiresAt: string,
  ) => void;

  verifyMfa: (
    token: string,
  ) => Promise<void>;

  /*
   * State management
   */

  clearAuthentication: () => void;

  clearMfaChallenge: () => void;

  /*
   * Login
   */

  login: (
    email: string,
    password: string,
  ) => Promise<LoginData>;

  /*
   * Session
   */

  refreshSession: () => Promise<boolean>;

  /*
   * Logout
   */

  logout: () => Promise<void>;

  logoutAll: () => Promise<void>;

  /*
   * Errors
   */

  clearError: () => void;
}


/*
 * ============================================================
 * CREDORA AUTH STORE
 * ============================================================
 *
 * IMPORTANT:
 *
 * This is a named export.
 *
 * Login.tsx uses:
 *
 * import { useAuthStore } from "../../store/auth.store";
 *
 * ============================================================
 */

export const useAuthStore = create<AuthState>(
  (set, get) => ({

    /*
     * ========================================================
     * INITIAL STATE
     * ========================================================
     */

    user: null,

    accessToken: null,

    sessionId: null,

    isAuthenticated: false,

    isLoading: false,

    authFlowState: "IDLE",

    mfaChallengeId: null,

    mfaSetupChallengeId: null,

    mfaExpiresAt: null,

    error: null,


    /*
     * ========================================================
     * SET AUTHENTICATION
     * ========================================================
     *
     * Called only after complete authentication.
     *
     * For MFA-enabled users this happens only after:
     *
     * Email + Password
     *        ↓
     * MFA verification
     *        ↓
     * Authenticated session
     *
     * ========================================================
     */

    setAuthentication: (data) => {

      if (
        !data.user ||
        !data.tokens ||
        !data.session
      ) {
        throw new Error(
          "Invalid authentication response.",
        );
      }

      set({

        user: data.user,

        accessToken:
          data.tokens.accessToken,

        sessionId:
          data.session.sessionId,

        isAuthenticated: true,

        isLoading: false,

        authFlowState:
          "AUTHENTICATED",

        mfaChallengeId: null,

        mfaSetupChallengeId: null,

        mfaExpiresAt: null,

        error: null,

      });
    },


    /*
     * ========================================================
     * SET MFA LOGIN CHALLENGE
     * ========================================================
     */

    setMfaChallenge: (
      challengeId,
      expiresAt,
    ) => {

      set({

        mfaChallengeId:
          challengeId,

        mfaSetupChallengeId:
          null,

        mfaExpiresAt:
          expiresAt,

        /*
         * No authenticated session exists yet.
         */

        user: null,

        accessToken: null,

        sessionId: null,

        isAuthenticated: false,

        authFlowState:
          "MFA_REQUIRED",

        error: null,

      });
    },


    /*
     * ========================================================
     * SET MFA SETUP CHALLENGE
     * ========================================================
     */

    setMfaSetupChallenge: (
      challengeId,
      expiresAt,
    ) => {

      set({

        mfaSetupChallengeId:
          challengeId,

        mfaChallengeId:
          null,

        mfaExpiresAt:
          expiresAt,

        /*
         * No authenticated session exists yet.
         */

        user: null,

        accessToken: null,

        sessionId: null,

        isAuthenticated: false,

        authFlowState:
          "MFA_SETUP_REQUIRED",

        error: null,

      });
    },


    /*
     * ========================================================
     * VERIFY MFA
     * ========================================================
     */

    verifyMfa: async (token) => {

      const challengeId =
        get().mfaChallengeId;


      /*
       * ------------------------------------------------------
       * Missing challenge
       * ------------------------------------------------------
       */

      if (!challengeId) {

        const message =
          "Your MFA session is missing or has expired. Please sign in again.";

        set({

          authFlowState:
            "ERROR",

          error: message,

        });

        throw new Error(message);
      }


      /*
       * ------------------------------------------------------
       * Start loading
       * ------------------------------------------------------
       */

      set({

        isLoading: true,

        error: null,

      });


      try {

        /*
         * ----------------------------------------------------
         * Backend MFA verification
         * ----------------------------------------------------
         */

        const response =
          await authService.verifyMfa({

            challengeId,

            token,

          });


        /*
         * ----------------------------------------------------
         * Validate API response
         * ----------------------------------------------------
         */

        if (
          !response.success ||
          !response.data
        ) {

          const message =
            response.message ||
            "Unable to verify your authentication code.";

          set({

            authFlowState:
              "ERROR",

            error: message,

          });

          throw new Error(message);
        }


        /*
         * ----------------------------------------------------
         * Authentication result
         * ----------------------------------------------------
         */

        const authenticationData =
          response.data;


        /*
         * ----------------------------------------------------
         * Validate authenticated response
         * ----------------------------------------------------
         */

        if (
          !authenticationData.user ||
          !authenticationData.tokens ||
          !authenticationData.session
        ) {

          const message =
            "Invalid authentication response.";

          set({

            authFlowState:
              "ERROR",

            error: message,

          });

          throw new Error(message);
        }


        /*
         * ----------------------------------------------------
         * Create authenticated frontend state
         * ----------------------------------------------------
         */

        get().setAuthentication({

          user:
            authenticationData.user,

          tokens:
            authenticationData.tokens,

          session:
            authenticationData.session,

        });

      } catch (error) {

        const message =
          error instanceof Error
            ? error.message
            : "Unable to verify your authentication code.";


        set({

          authFlowState:
            "ERROR",

          error: message,

        });


        throw error;

      } finally {

        set({

          isLoading: false,

        });

      }
    },


    /*
     * ========================================================
     * CLEAR AUTHENTICATION
     * ========================================================
     */

    clearAuthentication: () => {

      set({

        user: null,

        accessToken: null,

        sessionId: null,

        isAuthenticated: false,

        authFlowState: "IDLE",

        mfaChallengeId: null,

        mfaSetupChallengeId: null,

        mfaExpiresAt: null,

        error: null,

      });
    },


    /*
     * ========================================================
     * CLEAR MFA CHALLENGE
     * ========================================================
     */

    clearMfaChallenge: () => {

      set({

        mfaChallengeId: null,

        mfaSetupChallengeId: null,

        mfaExpiresAt: null,

      });
    },


    /*
     * ========================================================
     * LOGIN
     * ========================================================
     */

    login: async (
      email,
      password,
    ) => {

      /*
       * ------------------------------------------------------
       * Start authentication
       * ------------------------------------------------------
       */

      set({

        isLoading: true,

        authFlowState:
          "AUTHENTICATING",

        error: null,

      });


      try {

        /*
         * ----------------------------------------------------
         * Call backend
         * ----------------------------------------------------
         */

        const response =
          await authService.login({

            email,

            password,

          });


        /*
         * ----------------------------------------------------
         * Validate API response
         * ----------------------------------------------------
         */

        if (
          !response.success ||
          !response.data
        ) {

          const message =
            response.message ||
            "Unable to sign in.";

          set({

            authFlowState:
              "ERROR",

            error: message,

          });

          throw new Error(message);
        }


        /*
         * ----------------------------------------------------
         * Login response
         * ----------------------------------------------------
         *
         * LoginData is a union:
         *
         * TemporaryPasswordLoginResult
         * LoginMfaSetupRequiredResult
         * LoginMfaChallengeResult
         * LoginSuccess
         *
         * Therefore we must use "in" checks before accessing
         * properties that are not shared by every type.
         */

        const loginData =
          response.data;


        /*
         * ====================================================
         * 1. TEMPORARY PASSWORD RESET
         * ====================================================
         */

        if (
          "requiresPasswordReset" in loginData &&
          loginData.requiresPasswordReset === true
        ) {

          return loginData;
        }


        /*
         * ====================================================
         * 2. MFA SETUP REQUIRED
         * ====================================================
         */

        if (
          "requiresMfaSetup" in loginData &&
          loginData.requiresMfaSetup === true
        ) {

          /*
           * At this point TypeScript knows that loginData
           * is LoginMfaSetupRequiredResult.
           */

          get().setMfaSetupChallenge(

            loginData.setupChallengeId,

            loginData.expiresAt,

          );


          return loginData;
        }


        /*
         * ====================================================
         * 3. MFA VERIFICATION REQUIRED
         * ====================================================
         */

        if (
          "requiresMfa" in loginData &&
          loginData.requiresMfa === true
        ) {

          /*
           * At this point TypeScript knows that loginData
           * is LoginMfaChallengeResult.
           */

          get().setMfaChallenge(

            loginData.challengeId,

            loginData.expiresAt,

          );


          return loginData;
        }


        /*
         * ====================================================
         * 4. FULL AUTHENTICATION
         * ====================================================
         */

        if (
          "user" in loginData &&
          "tokens" in loginData &&
          "session" in loginData
        ) {

          /*
           * At this point TypeScript knows that loginData
           * is LoginSuccess.
           */

          get().setAuthentication(
            loginData,
          );


          return loginData;
        }


        /*
         * ====================================================
         * 5. UNEXPECTED RESPONSE
         * ====================================================
         */

        const message =
          "Unexpected authentication response.";


        set({

          authFlowState:
            "ERROR",

          error: message,

        });


        throw new Error(message);

      } catch (error) {

        const message =
          error instanceof Error
            ? error.message
            : "Unable to sign in.";


        set({

          authFlowState:
            "ERROR",

          error: message,

        });


        throw error;

      } finally {

        set({

          isLoading: false,

        });

      }
    },


    /*
     * ========================================================
     * REFRESH SESSION
     * ========================================================
     */

    refreshSession: async () => {

      set({

        isLoading: true,

        error: null,

      });


      try {

        /*
         * ----------------------------------------------------
         * Request token refresh
         * ----------------------------------------------------
         */

        const response =
          await authService.refresh();


        /*
         * ----------------------------------------------------
         * Refresh failed
         * ----------------------------------------------------
         */

        if (
          !response.success ||
          !response.data
        ) {

          get().clearAuthentication();

          return false;
        }


        /*
         * ----------------------------------------------------
         * Extract refreshed session data
         * ----------------------------------------------------
         */

        const {
          accessToken,
          sessionId,
        } = response.data;


        /*
         * ----------------------------------------------------
         * Current user
         * ----------------------------------------------------
         *
         * Full /auth/me session bootstrap will be added
         * when session restoration is implemented.
         */

        const currentUser =
          get().user;


        if (!currentUser) {

          get().clearAuthentication();

          return false;
        }


        /*
         * ----------------------------------------------------
         * Update session
         * ----------------------------------------------------
         */

        set({

          accessToken,

          sessionId,

          isAuthenticated: true,

          authFlowState:
            "AUTHENTICATED",

          error: null,

        });


        return true;

      } catch {

        get().clearAuthentication();

        return false;

      } finally {

        set({

          isLoading: false,

        });

      }
    },


    /*
     * ========================================================
     * LOGOUT
     * ========================================================
     */

    logout: async () => {

      set({

        isLoading: true,

      });


      try {

        await authService.logout();

      } finally {

        get().clearAuthentication();


        set({

          isLoading: false,

        });

      }
    },


    /*
     * ========================================================
     * LOGOUT ALL SESSIONS
     * ========================================================
     */

    logoutAll: async () => {

      set({

        isLoading: true,

      });


      try {

        const accessToken =
          get().accessToken;


        /*
         * No active access token.
         */

        if (!accessToken) {

          get().clearAuthentication();

          return;
        }


        /*
         * Backend uses the authenticated session
         * from the protected request.
         */

        await authService.logoutAll();

      } finally {

        get().clearAuthentication();


        set({

          isLoading: false,

        });

      }
    },


    /*
     * ========================================================
     * CLEAR ERROR
     * ========================================================
     */

    clearError: () => {

      set({

        error: null,

      });
    },

  }),
);