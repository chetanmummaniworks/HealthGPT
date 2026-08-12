import {
  Outlet,
} from "react-router-dom";

import Sidebar from "../components/Sidebar";


export default function MainLayout() {

  return (

    <div
      style={{
        minHeight: "100vh",
        display: "flex",
      }}
    >

      <Sidebar />

      <main
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >

        <Outlet />

      </main>

    </div>

  );
}
  