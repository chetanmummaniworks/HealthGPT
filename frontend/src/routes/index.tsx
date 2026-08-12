import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

import DashboardPage from "../pages/DashboardPage";
import SymptomCheckerPage from "../pages/SymptomCheckerPage";
import ReportAnalysisPage from "../pages/ReportAnalysisPage";

import ProtectedRoute from "../components/ProtectedRoute";
import ChatPage from "../pages/ChatPage";
import SettingsPage from "../pages/SettingsPage";
import HealthHistoryPage from "../pages/HealthHistoryPage"
import DoctorsPage from "../pages/DoctorsPage";
export const router = createBrowserRouter([
  // ==========================================================
  // PUBLIC ROUTES
  // ==========================================================

  {
    path: "/",
    children: [

      {
        index: true,
        element: <HomePage />,
      },

      {
        path: "login",
        element: <LoginPage />,
      },

      {
        path: "register",
        element: <RegisterPage />,
      },

    ],
  },


  // ==========================================================
  // PROTECTED APPLICATION
  // ==========================================================

  {
    element: <ProtectedRoute />,

    children: [

      {
        element: <MainLayout />,

        children: [

          {
            path: "/dashboard",
            element: <DashboardPage />,
          },

          {
            path: "/symptom-checker",
            element: <SymptomCheckerPage />,
          },

          {
            path: "/reports",
            element: <ReportAnalysisPage />,
          },

           {
           path: "/chat",
             element: <ChatPage />,
           },

{
  path: "/doctors",
  element: <DoctorsPage />,
},

{
  path: "/settings",
  element: <SettingsPage />,
},
{
  path:"/health-history",
  element:<HealthHistoryPage />
}
        ],
      },

    ],
  },

]);