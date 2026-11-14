import { Building2, ChevronDown } from "lucide-react";
import { useAuth } from "../../../context/useAuth";

function OrganizationSelector() {
  const { user } = useAuth();
  const organizationName =
    user?.organization?.organizationName || "Organization";
  const organizationLogo = user?.organization?.organizationLogo?.trim();

  return (
    <div className="header-selector-wrapper">

      <button
        type="button"
        className="header-selector"
      >

        <span className="header-selector-icon">
          {organizationLogo ? (
            <img
              className="header-selector-logo"
              src={organizationLogo}
              alt={`${organizationName} logo`}
            />
          ) : (
            <Building2 size={17} />
          )}
        </span>

        <span className="header-selector-content">

          <span className="header-selector-label">
            Organization
          </span>

          <span className="header-selector-value">
            {organizationName}
          </span>

        </span>

        <ChevronDown
          size={16}
          className="header-selector-arrow"
        />

      </button>

    </div>
  );
}

export default OrganizationSelector;