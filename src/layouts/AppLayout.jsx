import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import "./AppLayout.css";
import Sidebar from "../components/layout/Sidebar/Sidebar";
import Header from "../components/layout/Header/Header";

function AppLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Organization settings should not show the sidebar
  const isOrganizationSettings = location.pathname.startsWith("/organization-settings");
  const handleToggle = () => setCollapsed((prev) => !prev);

  // Determine the sidebar width CSS variable so header and other fixed elements stay in sync.
  const sidebarWidth = isOrganizationSettings ? "0px" : collapsed ? "64px" : "240px";

  return (
    <div className="app-layout">
      {/* SIDEBAR */}
      {!isOrganizationSettings && (
        <Sidebar collapsed={collapsed} onToggle={handleToggle} />
      )}
      {/* MAIN AREA */}
      <div
        className={`app-main ${isOrganizationSettings ? "no-sidebar" : collapsed ? "sidebar-collapsed" : ""}`}
        style={{ "--sidebar-width": sidebarWidth }}
      >
        {/* HEADER */}
       <Header collapsed={isOrganizationSettings ? true : collapsed} hideSidebarToggle={isOrganizationSettings}/>
        {/* PAGE CONTENT */}
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;