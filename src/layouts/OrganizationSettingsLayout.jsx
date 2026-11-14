import { Outlet } from "react-router-dom";
import "./OrganizationSettingsLayout.css";

function OrganizationSettingsLayout() {
  return (
    <main className="organization-settings-layout">
      <Outlet />
    </main>
  );
}

export default OrganizationSettingsLayout;