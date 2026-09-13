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
import { Link, useNavigate } from "react-router-dom";
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

  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [securityMessage, setSecurityMessage] = useState("");

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

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setServerError("");
    setSecurityMessage("");

    try {
      const loginData = await login(
        data.email,
        data.password,
      );

      if (loginData.user.mustResetPassword) {
        navigate("/reset-password", {
          replace: true,
          state: {
            email: data.email,
            temporaryPasswordLogin: true,
          },
        });

        return;
      }

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 429) {
          setServerError(
            "Too many sign-in attempts. Please wait a moment and try again.",
          );
          return;
        }

        if (error.status === 401) {
          setError("password", {
            type: "server",
            message:
              error.message || "Invalid email or password.",
          });
          return;
        }

        if (error.status === 403) {
          setServerError(error.message);
          return;
        }

        setServerError(
          error.message ||
            "We couldn't complete your sign-in. Please try again.",
        );

        return;
      }

      if (error instanceof Error) {
        setServerError(error.message);
        return;
      }

      setServerError(
        "Unable to sign in right now. Please try again.",
      );
    }
  };

  return (
    <div className="credora-auth-page">
      <div className="credora-auth-shell">
        {/* Left enterprise panel */}
        <section className="credora-auth-brand-panel">
          <Link to="/" className="credora-auth-logo">
            <span className="credora-auth-logo-mark">
              C
            </span>

            <span>Credora</span>
          </Link>

          <div className="credora-auth-brand-content">
            <div className="credora-auth-eyebrow">
              <ShieldCheck size={16} />
              Enterprise Credit Infrastructure
            </div>

            <h1>
              Intelligent lending.
              <br />
              <span>Trusted decisions.</span>
            </h1>

            <p>
              Securely access the Credora workspace for
              intelligent loan origination, credit operations,
              risk assessment and financial decision-making.
            </p>

            <div className="credora-security-list">
              <div className="credora-security-item">
                <div className="credora-security-icon">
                  <ShieldCheck size={17} />
                </div>

                <div>
                  <strong>Protected access</strong>
                  <span>
                    Enterprise authentication and session
                    controls
                  </span>
                </div>
              </div>

              <div className="credora-security-item">
                <div className="credora-security-icon">
                  <LockKeyhole size={17} />
                </div>

                <div>
                  <strong>Secure sessions</strong>
                  <span>
                    Short-lived access with protected session
                    management
                  </span>
                </div>
              </div>

              <div className="credora-security-item">
                <div className="credora-security-icon">
                  <CheckCircle2 size={17} />
                </div>

                <div>
                  <strong>Audited activity</strong>
                  <span>
                    Security-sensitive authentication events
                    are recorded
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="credora-auth-brand-footer">
            <span>Secure enterprise access</span>
            <span>•</span>
            <span>Credora Platform</span>
          </div>
        </section>

        {/* Login panel */}
        <section className="credora-auth-form-panel">
          <div className="credora-auth-form-container">
            <div className="credora-auth-mobile-logo">
              <Link to="/" className="credora-auth-logo">
                <span className="credora-auth-logo-mark">
                  C
                </span>

                <span>Credora</span>
              </Link>
            </div>

            <div className="credora-auth-heading">
              <div className="credora-auth-small-label">
                SECURE SIGN IN
              </div>

              <h2>Welcome back</h2>

              <p>
                Sign in to access your Credora workspace.
              </p>
            </div>

            {securityMessage && (
              <div
                className="credora-auth-success"
                role="status"
              >
                <CheckCircle2 size={18} />
                <span>{securityMessage}</span>
              </div>
            )}

            {serverError && (
              <div
                className="credora-auth-error-banner"
                role="alert"
              >
                <AlertCircle size={18} />

                <div>
                  <strong>Sign-in unsuccessful</strong>
                  <span>{serverError}</span>
                </div>
              </div>
            )}

            <form
              className="credora-login-form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              {/* Email */}
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
                  aria-invalid={Boolean(errors.email)}
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

              {/* Password */}
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
                      showPassword ? "text" : "password"
                    }
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    aria-invalid={Boolean(errors.password)}
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
                        (current) => !current,
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    aria-pressed={showPassword}
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

              <div className="credora-login-security-note">
                <LockKeyhole size={15} />

                <span>
                  Your session is protected using secure
                  authentication controls.
                </span>
              </div>

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

            <div className="credora-auth-divider">
              <span />
              <p>New to Credora?</p>
              <span />
            </div>

            <Link
              to="/register"
              className="credora-register-link"
            >
              Create an account
              <ArrowRight size={16} />
            </Link>

            <div className="credora-auth-legal">
              <span>
                By continuing, you agree to Credora's
              </span>

              <div>
                <Link to="/terms">Terms</Link>
                <span>•</span>
                <Link to="/privacy">Privacy</Link>
                <span>•</span>
                <Link to="/security">Security</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;