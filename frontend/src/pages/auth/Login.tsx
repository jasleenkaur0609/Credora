import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useForm,
  type SubmitHandler,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  loginSchema,
  type LoginFormData,
} from "../../schemas/auth.schema";

import { useAuthStore } from "../../store/auth.store";

import { ApiError } from "../../services/api-client";

import "./Login.css";


function Login() {
  const navigate = useNavigate();

  /*
   * ==========================================================
   * AUTH STORE
   * ==========================================================
   */

  const login = useAuthStore(
    (state) => state.login,
  );

  const isLoading = useAuthStore(
    (state) => state.isLoading,
  );


  /*
   * ==========================================================
   * LOCAL STATE
   * ==========================================================
   */

  const [showPassword, setShowPassword] =
    useState(false);

  const [serverError, setServerError] =
    useState("");

  const [securityMessage, setSecurityMessage] =
    useState("");


  /*
   * ==========================================================
   * FORM
   * ==========================================================
   */

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),

    mode: "onBlur",

    reValidateMode: "onChange",

    defaultValues: {
      email: "",
      password: "",
    },
  });


  /*
   * ==========================================================
   * LOGIN SUBMISSION
   * ==========================================================
   */

  const onSubmit: SubmitHandler<LoginFormData> =
    async (data) => {

      setServerError("");

      setSecurityMessage("");


      try {

        /*
         * ------------------------------------------------------
         * CALL LOGIN STORE
         * ------------------------------------------------------
         */

        const loginData = await login(
          data.email,
          data.password,
        );


        /*
         * ======================================================
         * 1. TEMPORARY PASSWORD RESET
         * ======================================================
         *
         * IMPORTANT:
         *
         * LoginResponse is a union.
         *
         * We must first check whether the property exists
         * before accessing it.
         */

        if (
          "requiresPasswordReset" in
            loginData &&
          loginData.requiresPasswordReset ===
            true
        ) {

          navigate("/reset-password", {
            replace: true,

            state: {
              email: data.email,

              temporaryPasswordLogin:
                true,

              resetToken:
                loginData.resetToken,
            },
          });

          return;
        }


        /*
         * ======================================================
         * 2. MFA SETUP REQUIRED
         * ======================================================
         *
         * The user's password was accepted.
         *
         * MFA has not yet been configured.
         *
         * No authenticated session exists.
         */

        if (
          "requiresMfaSetup" in
            loginData &&
          loginData.requiresMfaSetup ===
            true &&
          "setupChallengeId" in
            loginData &&
          "expiresAt" in
            loginData
        ) {

          navigate("/mfa/setup", {
            replace: true,
          });

          return;
        }


        /*
         * ======================================================
         * 3. MFA VERIFICATION REQUIRED
         * ======================================================
         *
         * The password was correct.
         *
         * The backend has created a short-lived MFA challenge.
         *
         * The auth store contains the challenge.
         *
         * No authenticated session exists yet.
         */

        if (
          "requiresMfa" in
            loginData &&
          loginData.requiresMfa ===
            true &&
          "challengeId" in
            loginData &&
          "expiresAt" in
            loginData
        ) {

          navigate("/mfa", {
            replace: true,
          });

          return;
        }


        /*
         * ======================================================
         * 4. FULL AUTHENTICATION
         * ======================================================
         *
         * The backend has returned:
         *
         * - authenticated user
         * - access token
         * - authenticated session
         *
         * This is the only state that can enter the dashboard.
         */

        if (
          "user" in loginData &&
          "tokens" in loginData &&
          "session" in loginData
        ) {

          navigate("/dashboard", {
            replace: true,
          });

          return;
        }


        /*
         * ======================================================
         * 5. UNEXPECTED RESPONSE
         * ======================================================
         */

        setServerError(
          "We couldn't complete your sign-in. Please try again.",
        );

      } catch (error) {

        /*
         * ======================================================
         * API ERROR
         * ======================================================
         */

        if (error instanceof ApiError) {

          /*
           * ----------------------------------------------------
           * RATE LIMIT
           * ----------------------------------------------------
           */

          if (error.status === 429) {

            setServerError(
              "Too many sign-in attempts. Please wait a moment and try again.",
            );

            return;
          }


          /*
           * ----------------------------------------------------
           * INVALID CREDENTIALS
           * ----------------------------------------------------
           */

          if (error.status === 401) {

            setError("password", {
              type: "server",

              message:
                error.message ||
                "Invalid email or password.",
            });

            return;
          }


          /*
           * ----------------------------------------------------
           * ACCOUNT / SECURITY RESTRICTION
           * ----------------------------------------------------
           */

          if (error.status === 403) {

            setServerError(
              error.message ||
                "Your account cannot sign in at this time.",
            );

            return;
          }


          /*
           * ----------------------------------------------------
           * OTHER API ERROR
           * ----------------------------------------------------
           */

          setServerError(
            error.message ||
              "We couldn't complete your sign-in. Please try again.",
          );

          return;
        }


        /*
         * ======================================================
         * STANDARD ERROR
         * ======================================================
         */

        if (error instanceof Error) {

          setServerError(
            error.message,
          );

          return;
        }


        /*
         * ======================================================
         * UNKNOWN ERROR
         * ======================================================
         */

        setServerError(
          "Unable to sign in right now. Please try again.",
        );
      }
    };


  /*
   * ==========================================================
   * UI
   * ==========================================================
   */

  return (
    <div className="credora-auth-page">

      <div className="credora-auth-shell">

        {/* ====================================================
            LEFT ENTERPRISE PANEL
            ==================================================== */}

        <section className="credora-auth-brand-panel">

          <Link
            to="/"
            className="credora-auth-logo"
          >

            <span className="credora-auth-logo-mark">
              C
            </span>

            <span>
              Credora
            </span>

          </Link>


          <div className="credora-auth-brand-content">

            <div className="credora-auth-eyebrow">

              <ShieldCheck size={16} />

              Enterprise Credit Infrastructure

            </div>


            <h1>

              Intelligent lending.

              <br />

              <span>
                Trusted decisions.
              </span>

            </h1>


            <p>

              Securely access the Credora workspace
              for intelligent loan origination,
              credit operations, risk assessment
              and financial decision-making.

            </p>


            <div className="credora-security-list">

              {/* Protected access */}

              <div className="credora-security-item">

                <div className="credora-security-icon">

                  <ShieldCheck size={17} />

                </div>


                <div>

                  <strong>
                    Protected access
                  </strong>

                  <span>
                    Enterprise authentication and
                    session controls
                  </span>

                </div>

              </div>


              {/* Secure sessions */}

              <div className="credora-security-item">

                <div className="credora-security-icon">

                  <LockKeyhole size={17} />

                </div>


                <div>

                  <strong>
                    Secure sessions
                  </strong>

                  <span>
                    Short-lived access with protected
                    session management
                  </span>

                </div>

              </div>


              {/* Audited activity */}

              <div className="credora-security-item">

                <div className="credora-security-icon">

                  <CheckCircle2 size={17} />

                </div>


                <div>

                  <strong>
                    Audited activity
                  </strong>

                  <span>
                    Security-sensitive authentication
                    events are recorded
                  </span>

                </div>

              </div>

            </div>

          </div>


          <div className="credora-auth-brand-footer">

            <span>
              Secure enterprise access
            </span>

            <span>
              •
            </span>

            <span>
              Credora Platform
            </span>

          </div>

        </section>


        {/* ====================================================
            LOGIN PANEL
            ==================================================== */}

        <section className="credora-auth-form-panel">

          <div className="credora-auth-form-container">

            {/* Mobile logo */}

            <div className="credora-auth-mobile-logo">

              <Link
                to="/"
                className="credora-auth-logo"
              >

                <span className="credora-auth-logo-mark">
                  C
                </span>

                <span>
                  Credora
                </span>

              </Link>

            </div>


            {/* Heading */}

            <div className="credora-auth-heading">

              <div className="credora-auth-small-label">

                SECURE SIGN IN

              </div>


              <h2>
                Welcome back
              </h2>


              <p>

                Sign in to access your Credora
                workspace.

              </p>

            </div>


            {/* =================================================
                SECURITY SUCCESS MESSAGE
                ================================================= */}

            {securityMessage && (

              <div
                className="credora-auth-success"
                role="status"
              >

                <CheckCircle2 size={18} />

                <span>
                  {securityMessage}
                </span>

              </div>

            )}


            {/* =================================================
                ERROR MESSAGE
                ================================================= */}

            {serverError && (

              <div
                className="credora-auth-error-banner"
                role="alert"
              >

                <AlertCircle size={18} />

                <div>

                  <strong>
                    Sign-in unsuccessful
                  </strong>

                  <span>
                    {serverError}
                  </span>

                </div>

              </div>

            )}


            {/* =================================================
                LOGIN FORM
                ================================================= */}

            <form
              className="credora-login-form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >

              {/* =================================================
                  EMAIL
                  ================================================= */}

              <div className="credora-form-field">

                <label htmlFor="login-email">

                  Work email

                </label>


                <input
                  id="login-email"
                  type="email"
                  autoComplete="username"
                  inputMode="email"
                  placeholder="name@company.com"

                  aria-invalid={Boolean(
                    errors.email,
                  )}

                  aria-describedby={
                    errors.email
                      ? "login-email-error"
                      : undefined
                  }

                  {...register("email")}
                />


                {errors.email && (

                  <span
                    id="login-email-error"
                    className="credora-field-error"
                    role="alert"
                  >

                    {errors.email.message}

                  </span>

                )}

              </div>


              {/* =================================================
                  PASSWORD
                  ================================================= */}

              <div className="credora-form-field">

                <div className="credora-field-header">

                  <label htmlFor="login-password">

                    Password

                  </label>


                  <Link
                    to="/forgot-password"
                    className="credora-forgot-link"
                  >

                    Forgot password?

                  </Link>

                </div>


                <div className="credora-password-wrapper">

                  <input
                    id="login-password"

                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }

                    autoComplete="current-password"

                    placeholder="Enter your password"

                    aria-invalid={Boolean(
                      errors.password,
                    )}

                    aria-describedby={
                      errors.password
                        ? "login-password-error"
                        : undefined
                    }

                    {...register("password")}
                  />


                  <button
                    type="button"
                    className="credora-password-toggle"

                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current,
                      )
                    }

                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }

                    aria-pressed={
                      showPassword
                    }
                  >

                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}

                  </button>

                </div>


                {errors.password && (

                  <span
                    id="login-password-error"
                    className="credora-field-error"
                    role="alert"
                  >

                    {errors.password.message}

                  </span>

                )}

              </div>


              {/* =================================================
                  SECURITY NOTE
                  ================================================= */}

              <div className="credora-login-security-note">

                <LockKeyhole size={15} />

                <span>

                  Your session is protected using
                  secure authentication controls.

                </span>

              </div>


              {/* =================================================
                  SUBMIT BUTTON
                  ================================================= */}

              <button
                type="submit"
                className="credora-login-submit"
                disabled={isLoading}
              >

                {isLoading ? (

                  <>

                    <span className="credora-spinner" />

                    Signing in...

                  </>

                ) : (

                  <>

                    Sign in

                    <ArrowRight size={17} />

                  </>

                )}

              </button>

            </form>


            {/* =================================================
                REGISTER DIVIDER
                ================================================= */}

            <div className="credora-auth-divider">

              <span />

              <p>
                New to Credora?
              </p>

              <span />

            </div>


            {/* =================================================
                REGISTER LINK
                ================================================= */}

            <Link
              to="/register"
              className="credora-register-link"
            >

              Create an account

              <ArrowRight size={16} />

            </Link>


            {/* =================================================
                LEGAL
                ================================================= */}

            <div className="credora-auth-legal">

              <span>

                By continuing, you agree to
                Credora's

              </span>


              <div>

                <Link to="/terms">
                  Terms
                </Link>

                <span>
                  •
                </span>

                <Link to="/privacy">
                  Privacy
                </Link>

                <span>
                  •
                </span>

                <Link to="/security">
                  Security
                </Link>

              </div>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}


export default Login;