import { NavLink, useLocation } from "react-router-dom";

import {
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { useState } from "react";
import menuConfig from "./menuConfig";
import "./Sidebar.css";

import emsLogo from "../../../assets/logo.png";

function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();

  const [openMenus, setOpenMenus] = useState({
    "Employee Management": true,
  });

  const toggleMenu = (label) => {
    setOpenMenus((previous) => ({
      ...previous,
      [label]: !previous[label],
    }));
  };

  const hasActiveChild = (items = []) => {
    return items.some((item) => {
      if (item.path && location.pathname === item.path) {
        return true;
      }
      if (item.children) {
        return hasActiveChild(item.children);
      }
      return false;
    });
  };


  return (
    <aside className={`ems-sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      {/* LOGO — now toggles via the prop, not local state */}
      <div className="sidebar-logo" onClick={onToggle}>
        <div className="sidebar-logo-image">
          <img src={emsLogo} alt="EMS Logo" />
        </div>

        <div className="sidebar-logo-text">
          <h2>EMS</h2>
          <span>Employee Management</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        {menuConfig.map((menu) => {
          if (menu.type === "item") {
            return (
              <NavLink
                key={menu.path}
                to={menu.path}
                className={({ isActive }) => `sidebar-dashboard-item ${isActive ? "active" : ""}`}
              >
                {menu.icon && <menu.icon size={21} />}
                <span>{menu.label}</span>
              </NavLink>
            );
          }

          const isOpen = openMenus[menu.label];
          const isModuleActive = hasActiveChild(menu.children);
          const Icon = menu.icon || null;

          return (
            <div className="sidebar-menu-section" key={menu.label}>
              <button
                type="button"
                className={`sidebar-parent ${isModuleActive ? "active" : ""}`}
                onClick={() => toggleMenu(menu.label)}
              >
                <div className="sidebar-parent-left">
                  {Icon && <Icon size={21} />}
                  <span>{menu.label}</span>
                </div>
                <span className="sidebar-parent-arrow">
                  {isOpen ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
                </span>
              </button>

              {isOpen && (
                <div className="sidebar-children">
                  {menu.children?.map((child) => (
                    <SidebarChild
                      key={child.path || child.label}
                      item={child}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                      location={location}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

function SidebarChild({ item, openMenus, toggleMenu, location }) {
  if (item.children && item.children.length > 0) {
    const isOpen = openMenus[item.label];
    const isNestedActive = item.children?.some((child) => {
      if (child.path && (location.pathname === child.path || location.pathname.startsWith(child.path + "/"))) return true;
      if (child.children) {
        return child.children.some((nestedChild) => nestedChild.path && (location.pathname === nestedChild.path || location.pathname.startsWith(nestedChild.path + "/")));
      }
      return false;
    });

    return (
      <div className="sidebar-nested-section">
        <button
          type="button"
          className={`sidebar-child sidebar-child-button ${isNestedActive ? "active" : ""}`}
          onClick={() => toggleMenu(item.label)}
        >
          <span className="sidebar-child-dot">•</span>
          <span className="sidebar-child-label">{item.label}</span>
          <span className="sidebar-child-arrow">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        </button>

        {isOpen && (
          <div className="sidebar-nested-children">
            {item.children?.map((nestedItem) => (
              <SidebarChild
                key={nestedItem.path || nestedItem.label}
                item={nestedItem}
                openMenus={openMenus}
                toggleMenu={toggleMenu}
                location={location}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink to={item.path} className={({ isActive }) => `sidebar-child ${isActive ? "active" : ""}`}>
      <span className="sidebar-child-dot">•</span>
      <span className="sidebar-child-label">{item.label}</span>
    </NavLink>
  );
}

export default Sidebar;