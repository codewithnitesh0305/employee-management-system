import OrganizationSelector from "./OrganizationSelector";
import BranchSelector from "./BranchSelector";
import Notifications from "./Notifications";
import ProfileMenu from "./ProfileMenu";

import "./Header.css";

function Header({ collapsed }) {
  return (
    <header className={`ems-header ${
        collapsed ? "sidebar-collapsed" : ""
      }`}
    >

      {/* =====================================================
          LEFT
      ===================================================== */}

      <div className="header-left">
        <div className="header-context">
          <OrganizationSelector />
          <BranchSelector />
        </div>
      </div>


      {/* =====================================================
          RIGHT
      ===================================================== */}

      <div className="header-right">
        <Notifications />
        <div className="header-divider" />
        <ProfileMenu />
      </div>
    </header>
  );
}

export default Header;