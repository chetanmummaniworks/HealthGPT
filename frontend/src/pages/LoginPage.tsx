import {
  useState,
  type FormEvent,
} from "react";
import {
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useTranslation,
} from "react-i18next";

import { useAuth } from "../context/AuthContext";

import {
  GoogleLogin,
} from "@react-oauth/google";

import {
  loginUser,
  googleLoginUser,
} from "../api/auth";

export default function LoginPage() {
  const { t } = useTranslation();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const { login } = useAuth();

  const navigate = useNavigate();
  const [showPassword, setShowPassword] =
  useState(false);
  // ==========================================================
  // EMAIL / PASSWORD LOGIN
  // ==========================================================

  async function handleSubmit(
    e: FormEvent,
  ) {
    e.preventDefault();

    setError(null);

    setIsSubmitting(true);

    try {
      const {
        access_token,
      } = await loginUser({
        email,
        password,
      });

      await login(
        access_token,
      );

      navigate(
        "/dashboard",
      );
    } catch {
      setError(
        t(
          "login.invalidCredentials",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // ==========================================================
  // GOOGLE LOGIN
  // ==========================================================

  async function handleGoogleSuccess(
    credential: string,
  ) {
    setError(null);

    setIsSubmitting(true);

    try {
      const {
        access_token,
      } = await googleLoginUser(
        credential,
      );

      await login(
        access_token,
      );

      navigate(
        "/dashboard",
      );
    } catch (error) {
      console.error(
        "Google login failed:",
        error,
      );

      setError(
        t(
          "login.googleFailed",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">

      <div className="w-full max-w-md">

        {/* ================================================== */}
        {/* HEALTHGPT BRAND */}
        {/* ================================================== */}

        <div className="flex flex-col items-center">

          <img
            src="/healthgpt-logo.jpeg"
            alt="HealthGPT AI"
            className="h-28 w-28 object-contain"
          />

          <h1 className="mt-2 text-center text-3xl font-bold text-gray-900">
            HealthGPT AI
          </h1>

          <p className="mt-2 text-center text-gray-600">
            {t("login.subtitle")}
          </p>

        </div>

        {/* ================================================== */}
        {/* LOGIN FORM */}
        {/* ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-lg bg-white p-6 shadow"
        >

          {/* EMAIL */}

          <div>

            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              {t("login.email")}
            </label>

            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value,
                )
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500"
            />

          </div>

          {/* PASSWORD */}
          <div className="relative mt-1">
<label
  htmlFor="password"
  className="block text-sm font-medium text-gray-700 mb-1"
>
  Password
</label>

<input
  id="password"
  type={showPassword ? "text" : "password"}
  required
  value={password}
  onChange={(e) =>
    setPassword(e.target.value)
  }
  className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500"
/>

  <button
    type="button"
    onClick={() =>
      setShowPassword((prev) => !prev)
    }
    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
    aria-label={
      showPassword
        ? "Hide password"
        : "Show password"
    }
  >
    {showPassword ? (
      <EyeOff size={18} />
    ) : (
      <Eye size={18} />
    )}
  </button>
</div>

          {/* ERROR */}

          {error && (
            <p
              className="text-sm text-red-600"
              role="alert"
            >
              {error}
            </p>
          )}

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {isSubmitting
              ? t("login.signingIn")
              : t("login.signIn")}
          </button>

          {/* ================================================= */}
          {/* DIVIDER */}
          {/* ================================================= */}

          <div className="flex items-center gap-3">

            <div className="h-px flex-1 bg-gray-200" />

            <span className="text-sm text-gray-500">
              {t("login.or")}
            </span>

            <div className="h-px flex-1 bg-gray-200" />

          </div>

          {/* ================================================= */}
          {/* GOOGLE LOGIN */}
          {/* ================================================= */}

          <div className="flex justify-center">

            <GoogleLogin
              onSuccess={(
                credentialResponse,
              ) => {
                if (
                  credentialResponse.credential
                ) {
                  handleGoogleSuccess(
                    credentialResponse.credential,
                  );
                }
              }}
              onError={() => {
                setError(
                  t(
                    "login.googleFailed",
                  ),
                );
              }}
              useOneTap={false}
            />

          </div>

        </form>

        {/* ================================================== */}
        {/* REGISTER LINK */}
        {/* ================================================== */}

        <p className="mt-4 text-center text-sm text-gray-600">

          {t("login.noAccount")}{" "}

          <Link
            to="/register"
            className="text-teal-600 hover:underline"
          >
            {t("login.register")}
          </Link>

        </p>

      </div>

    </div>
  );
}