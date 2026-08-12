import {
  NavLink,
  useNavigate,
} from "react-router-dom";
import {
  History,
  // existing imports...
} from "lucide-react";
import {
  LayoutDashboard,
  Stethoscope,
  FileText,
  MessageCircle,
  MapPin,
  Settings,
  LogOut,
} from "lucide-react";

import { useTranslation } from "react-i18next";

import { useAuth } from "../context/AuthContext";


// ==========================================================
// NAVIGATION
// ==========================================================

const navigation = [
  {
    key: "dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    key: "symptomChecker",
    path: "/symptom-checker",
    icon: Stethoscope,
  },
  {
    key: "medicalReports",
    path: "/reports",
    icon: FileText,
  },
  {
    key: "aiChat",
    path: "/chat",
    icon: MessageCircle,
  },
  {
    key: "findDoctors",
    path: "/doctors",
    icon: MapPin,
  },
  {
  key: "healthHistory",
  path: "/health-history",
  icon: History,
},
];


export default function Sidebar() {

  const navigate =
    useNavigate();

  const { t } =
    useTranslation();

  const { logout } =
    useAuth();


  // ========================================================
  // LOGOUT
  // ========================================================

  function handleLogout() {

    logout();

    navigate("/login");

  }


  return (

    <aside
      style={{
        width: "250px",
        minHeight: "100vh",
        borderRight:
          "1px solid #e5e7eb",
        padding:
          "24px 16px",
        display: "flex",
        flexDirection: "column",
        boxSizing:
          "border-box",
      }}
    >

      {/* ================================================== */}
      {/* LOGO */}
      {/* ================================================== */}

      <div
        style={{
          padding:
            "8px 12px 28px",
        }}
      >

        <h2
          style={{
            margin: 0,
          }}
        >
          🩺 HealthGPT
        </h2>


        <p
          style={{
            margin:
              "6px 0 0",
            fontSize:
              "13px",
            opacity:
              0.7,
          }}
        >
          {t("app.subtitle")}
        </p>

      </div>


      {/* ================================================== */}
      {/* MAIN NAVIGATION */}
      {/* ================================================== */}

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >

        {navigation.map(
          ({
            key,
            path,
            icon: Icon,
          }) => (

            <NavLink
              key={path}
              to={path}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding:
                  "11px 12px",
                borderRadius:
                  "8px",
                textDecoration:
                  "none",
                color: "inherit",
                background:
                  isActive
                    ? "#eef2ff"
                    : "transparent",
                fontWeight:
                  isActive
                    ? 600
                    : 400,
              })}
            >

              <Icon
                size={19}
              />

              <span>
                {t(
                  `navigation.${key}`,
                )}
              </span>

            </NavLink>

          ),
        )}

      </nav>


      {/* ================================================== */}
      {/* BOTTOM NAVIGATION */}
      {/* ================================================== */}

      <div
        style={{
          marginTop:
            "auto",
          display: "flex",
          flexDirection:
            "column",
          gap: "6px",
        }}
      >

        {/* SETTINGS */}

        <NavLink
          to="/settings"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding:
              "11px 12px",
            borderRadius:
              "8px",
            textDecoration:
              "none",
            color: "inherit",
            background:
              isActive
                ? "#eef2ff"
                : "transparent",
            fontWeight:
              isActive
                ? 600
                : 400,
          })}
        >

          <Settings
            size={19}
          />

          <span>
            {t(
              "navigation.settings",
            )}
          </span>

        </NavLink>


        {/* LOGOUT */}

        <button
          type="button"
          onClick={
            handleLogout
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding:
              "11px 12px",
            border: "none",
            background:
              "transparent",
            borderRadius:
              "8px",
            cursor:
              "pointer",
            textAlign:
              "left",
            fontSize:
              "14px",
          }}
        >

          <LogOut
            size={19}
          />

          <span>
            {t(
              "navigation.logout",
            )}
          </span>

        </button>

      </div>

    </aside>

  );
}