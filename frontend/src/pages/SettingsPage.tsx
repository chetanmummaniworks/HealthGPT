import { useState } from "react";
import {
  Save,
  User,
  Globe,
} from "lucide-react";

import { useTranslation } from "react-i18next";
import i18n from "../i18n";

import { useAuth } from "../context/AuthContext";
import apiClient from "../api/client";


// ==========================================================
// SUPPORTED LANGUAGES
// ==========================================================

const LANGUAGES = [
  {
    code: "English",
    label: "English",
  },
  {
    code: "Hindi",
    label: "हिंदी",
  },
  {
    code: "Telugu",
    label: "తెలుగు",
  },
  {
    code: "Tamil",
    label: "தமிழ்",
  },
  {
    code: "Bengali",
    label: "বাংলা",
  },
  {
    code: "Marathi",
    label: "मराठी",
  },
  {
    code: "Kannada",
    label: "ಕನ್ನಡ",
  },
  {
    code: "Malayalam",
    label: "മലയാളം",
  },
  {
    code: "Gujarati",
    label: "ગુજરાતી",
  },
];


// ==========================================================
// LANGUAGE CODE MAP
// ==========================================================

const LANGUAGE_MAP: Record<
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


export default function SettingsPage() {

  const { user } = useAuth();

  const { t } =
    useTranslation();


  const [language, setLanguage] =
    useState(
      user?.preferred_language ||
      "English",
    );


  const [saving, setSaving] =
    useState(false);


  const [message, setMessage] =
    useState("");


  // ========================================================
  // SAVE LANGUAGE
  // ========================================================

  async function handleSave() {

    setSaving(true);

    setMessage("");


    try {

      await apiClient.patch(
        "/auth/preferences",
        {
          preferred_language:
            language,
        },
      );


      setMessage(
        t("settings.saved"),
      );


      // ----------------------------------------------------
      // Change UI language immediately
      // ----------------------------------------------------

      const languageCode =
        LANGUAGE_MAP[
          language
        ] || "en";


      await i18n.changeLanguage(
        languageCode,
      );


    } catch (error) {

      console.error(
        "Failed to save language:",
        error,
      );


      setMessage(
        t("settings.error"),
      );


    } finally {

      setSaving(false);

    }
  }


  return (

    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "40px 32px",
      }}
    >

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <header
        style={{
          marginBottom: "32px",
        }}
      >

        <h1
          style={{
            margin: 0,
            fontSize: "30px",
          }}
        >
          {t("settings.title")}
        </h1>


        <p
          style={{
            marginTop: "8px",
            opacity: 0.65,
          }}
        >
          {t(
            "settings.description",
          )}
        </p>

      </header>


      {/* ================================================== */}
      {/* PROFILE */}
      {/* ================================================== */}

      <section
        style={{
          border:
            "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "20px",
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "22px",
          }}
        >

          <User size={20} />

          <h2
            style={{
              margin: 0,
              fontSize: "20px",
            }}
          >
            {t(
              "settings.profile",
            )}
          </h2>

        </div>


        <div
          style={{
            display: "grid",
            gap: "16px",
          }}
        >

          {/* FULL NAME */}

          <div>

            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "13px",
                opacity: 0.65,
              }}
            >
              {t(
                "settings.fullName",
              )}
            </label>


            <input
              value={
                user?.full_name ||
                ""
              }
              disabled
              style={{
                width: "100%",
                boxSizing:
                  "border-box",
                padding:
                  "11px 12px",
                border:
                  "1px solid #d1d5db",
                borderRadius:
                  "8px",
              }}
            />

          </div>


          {/* EMAIL */}

          <div>

            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "13px",
                opacity: 0.65,
              }}
            >
              {t(
                "settings.email",
              )}
            </label>


            <input
              value={
                user?.email ||
                ""
              }
              disabled
              style={{
                width: "100%",
                boxSizing:
                  "border-box",
                padding:
                  "11px 12px",
                border:
                  "1px solid #d1d5db",
                borderRadius:
                  "8px",
              }}
            />

          </div>

        </div>

      </section>


      {/* ================================================== */}
      {/* LANGUAGE */}
      {/* ================================================== */}

      <section
        style={{
          border:
            "1px solid #e5e7eb",
          borderRadius:
            "16px",
          padding: "24px",
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "22px",
          }}
        >

          <Globe size={20} />

          <div>

            <h2
              style={{
                margin: 0,
                fontSize: "20px",
              }}
            >
              {t(
                "settings.language",
              )}
            </h2>


            <p
              style={{
                margin:
                  "5px 0 0",
                fontSize:
                  "13px",
                opacity:
                  0.65,
              }}
            >
              {t(
                "settings.languageDescription",
              )}
            </p>

          </div>

        </div>


        {/* LANGUAGE LABEL */}

        <label
          style={{
            display: "block",
            marginBottom: "7px",
            fontSize: "13px",
          }}
        >
          {t(
            "settings.preferredLanguage",
          )}
        </label>


        {/* LANGUAGE SELECT */}

        <select
          value={language}
          onChange={(
            event,
          ) =>
            setLanguage(
              event.target.value,
            )
          }
          style={{
            width: "100%",
            padding: "12px",
            border:
              "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "14px",
            background: "white",
          }}
        >

          {LANGUAGES.map(
            ({
              code,
              label,
            }) => (

              <option
                key={code}
                value={code}
              >
                {label}
              </option>

            ),
          )}

        </select>


        {/* SAVE BUTTON */}

        <button
          onClick={
            handleSave
          }
          disabled={
            saving
          }
          style={{
            marginTop: "20px",
            display:
              "inline-flex",
            alignItems:
              "center",
            gap: "8px",
          }}
        >

          <Save size={17} />

          {saving
            ? t(
                "settings.saving",
              )
            : t(
                "settings.save",
              )}

        </button>


        {/* MESSAGE */}

        {message && (

          <p
            style={{
              marginTop: "12px",
              fontSize: "14px",
            }}
          >
            {message}
          </p>

        )}

      </section>


      {/* ================================================== */}
      {/* DISCLAIMER */}
      {/* ================================================== */}

      <p
        style={{
          marginTop: "28px",
          fontSize: "12px",
          opacity: 0.55,
          lineHeight: 1.6,
        }}
      >
        {t(
          "dashboard.disclaimer.text",
        )}
      </p>

    </main>

  );
}