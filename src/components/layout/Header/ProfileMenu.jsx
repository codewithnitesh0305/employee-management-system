import { useState, useRef, useEffect } from "react";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const displayName =
    [user?.employeeName, user?.name, user?.emailId, user?.email].find(
      (value) => typeof value === "string" && value.trim()
    )?.trim() || "User";
  const initials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const role =
    [user?.designationName, user?.departmentName, user?.role].find(
      (value) => typeof value === "string" && value.trim()
    )?.trim() || "Employee";

  const handleLogout = async () => {
    setIsOpen(false);

    try {
      await logout();
      navigate("/login", {
        replace: true,
        state: { logoutSuccess: "Signed out successfully." },
      });
    } catch (error) {
      navigate("/login", {
        replace: true,
        state: { logoutError: getApiErrorMessage(error) },
      });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="header-profile-wrapper" ref={menuRef}>
      <button
        type="button"
        className="header-profile"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="profile-avatar">{initials}</div>
        <div className="profile-info">
          <span className="profile-name">{displayName}</span>
          <span className="profile-role">{role}</span>
        </div>
        <ChevronDown
          size={16}
          className={`profile-arrow ${isOpen ? "profile-arrow-open" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="profile-dropdown">
          <Link
            to="/profile"
            className="profile-dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            <User size={16} />
            <span>Profile</span>
          </Link>
          <Link
            to="/organization-settings"
            className="profile-dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            <Settings size={16} />
            <span>Organization Settings</span>
          </Link>
          <button
            type="button"
            className="profile-dropdown-item"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;