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
  loginUser,
  registerUser,
} from "../api/auth";

import {
  useAuth,
} from "../context/AuthContext";

import {
  useTranslation,
} from "react-i18next";

import i18n from "../i18n";

export default function RegisterPage() {
  const { t } =
    useTranslation();

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [preferredLanguage, setPreferredLanguage] =
    useState("English");

  const [error, setError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [showPassword, setShowPassword] =
  useState(false);

  const { login } =
    useAuth();

  const navigate =
    useNavigate();

  // ==========================================================
  // REGISTER
  // ==========================================================

  async function handleSubmit(
    e: FormEvent,
  ) {
    e.preventDefault();

    setError(null);

    setIsSubmitting(true);

    try {

      // --------------------------------------------------
      // Register user
      // --------------------------------------------------

      await registerUser({
        full_name: fullName,
        email,
        password,
        preferred_language:
          preferredLanguage,
      });

      // --------------------------------------------------
      // Auto-login
      // --------------------------------------------------

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

    } catch (err: unknown) {

      if (
        err instanceof Error &&
        "response" in err
      ) {

        const status =
          (
            err as {
              response?: {
                status?: number;
              };
            }
          ).response?.status;

        if (status === 409) {

          setError(
            "An account with this email already exists",
          );

        } else {

          setError(
            "Registration failed. Please try again.",
          );
        }

      } else {

        setError(
          "Registration failed. Please try again.",
        );
      }

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
            {t("register.subtitle")}
          </p>

        </div>

        {/* ================================================== */}
        {/* FORM */}
        {/* ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-lg bg-white p-6 shadow"
        >

          {/* FULL NAME */}

          <div>

            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              {t("register.fullName")}
            </label>

            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) =>
                setFullName(
                  e.target.value,
                )
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500"
            />

          </div>

          {/* EMAIL */}

          <div>

            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              {t("register.email")}
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

          {/* ================================================== */}
          {/* LANGUAGE */}
          {/* ================================================== */}

          <div>

            <label
              htmlFor="preferredLanguage"
              className="block text-sm font-medium text-gray-700"
            >
              {t(
                "register.preferredLanguage",
              )}
            </label>

            <select
              id="preferredLanguage"
              value={preferredLanguage}
              onChange={async (e) => {

                const language =
                  e.target.value;

                setPreferredLanguage(
                  language,
                );

                const languageMap: Record<
                  string,
                  string
                > = {
                  English: "en",
                  Hindi: "hi",
                  Telugu: "te",
                  Tamil: "ta",
                  Bengali: "bn",
                  Marathi: "mr",
                  Kannada: "kn",
                  Malayalam: "ml",
                  Gujarati: "gu",
                };

                await i18n.changeLanguage(
                  languageMap[
                    language
                  ] ?? "en",
                );
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500"
            >

              <option value="English">
                {t("common.english")}
              </option>

              <option value="Hindi">
                {t("common.hindi")}
              </option>

              <option value="Telugu">
                {t("common.telugu")}
              </option>

              <option value="Tamil">
                {t("common.tamil")}
              </option>

              <option value="Bengali">
                {t("common.bengali")}
              </option>

              <option value="Marathi">
                {t("common.marathi")}
              </option>

              <option value="Kannada">
                {t("common.kannada")}
              </option>

              <option value="Malayalam">
                {t("common.malayalam")}
              </option>

              <option value="Gujarati">
                {t("common.gujarati")}
              </option>

            </select>

            <p className="mt-1 text-xs text-gray-500">
              {t(
                "register.languageDescription",
              )}
            </p>

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

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {isSubmitting
              ? t(
                  "register.creating",
                )
              : t(
                  "register.createAccount",
                )}
          </button>

        </form>

        {/* ================================================== */}
        {/* LOGIN LINK */}
        {/* ================================================== */}

        <p className="mt-4 text-center text-sm text-gray-600">

          {t(
            "register.alreadyHaveAccount",
          )}{" "}

          <Link
            to="/login"
            className="text-teal-600 hover:underline"
          >
            {t(
              "register.signIn",
            )}
          </Link>

        </p>

      </div>

    </div>
  );
}