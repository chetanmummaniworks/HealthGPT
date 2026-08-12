import { useNavigate } from "react-router-dom";

import {
  Stethoscope,
  FileText,
  MessageCircle,
  MapPin,
  ArrowRight,
} from "lucide-react";

import { useTranslation } from "react-i18next";

import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const { t } = useTranslation();

  const firstName =
    user?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "there";

  // ==========================================================
  // TIME-BASED GREETING
  // ==========================================================

  const hour = new Date().getHours();

  let greetingKey = "dashboard.greeting.morning";

  if (hour >= 12 && hour < 17) {
    greetingKey = "dashboard.greeting.afternoon";
  } else if (hour >= 17 && hour < 21) {
    greetingKey = "dashboard.greeting.evening";
  } else if (hour >= 21 || hour < 5) {
    greetingKey = "dashboard.greeting.night";
  }

  // ==========================================================
  // DASHBOARD FEATURES
  // ==========================================================

  const features = [
    {
      key: "symptomChecker",
      path: "/symptom-checker",
      icon: Stethoscope,
    },
    {
      key: "reports",
      path: "/reports",
      icon: FileText,
    },
    {
      key: "chat",
      path: "/chat",
      icon: MessageCircle,
    },
    {
      key: "doctors",
      path: "/doctors",
      icon: MapPin,
    },
  ];

  return (
    <main
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "40px 32px",
      }}
    >
      {/* =====================================================
          HEADER
          ===================================================== */}

      <section
        style={{
          marginBottom: "40px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            opacity: 0.65,
          }}
        >
          {t("app.name")}
        </p>

        <h1
          style={{
            margin: "8px 0 10px",
            fontSize: "32px",
          }}
        >
          {t(greetingKey, {
            name: firstName,
          })}
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: "16px",
            opacity: 0.7,
          }}
        >
          {t("dashboard.question")}
        </p>
      </section>

      {/* =====================================================
          FEATURE CARDS
          ===================================================== */}

      <section>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {features.map(
            ({
              key,
              path,
              icon: Icon,
            }) => (
              <article
                key={path}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "24px",
                  background: "#ffffff",
                }}
              >
                {/* Icon */}

                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f3f4f6",
                    marginBottom: "18px",
                  }}
                >
                  <Icon size={22} />
                </div>

                {/* Title */}

                <h2
                  style={{
                    margin: "0 0 10px",
                    fontSize: "20px",
                  }}
                >
                  {t(
                    `dashboard.${key}.title`,
                  )}
                </h2>

                {/* Description */}

                <p
                  style={{
                    margin: "0 0 22px",
                    lineHeight: 1.6,
                    opacity: 0.7,
                  }}
                >
                  {t(
                    `dashboard.${key}.description`,
                  )}
                </p>

                {/* Button */}

                <button
                  onClick={() =>
                    navigate(path)
                  }
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {t(
                    `dashboard.${key}.button`,
                  )}

                  <ArrowRight size={16} />
                </button>
              </article>
            ),
          )}
        </div>
      </section>

      {/* =====================================================
          DISCLAIMER
          ===================================================== */}

      <section
        style={{
          marginTop: "40px",
          padding: "18px 20px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          fontSize: "13px",
          lineHeight: 1.6,
          opacity: 0.75,
        }}
      >
        <strong>
          {t("dashboard.disclaimer.title")}
        </strong>{" "}

        {t("dashboard.disclaimer.text")}
      </section>
    </main>
  );
}