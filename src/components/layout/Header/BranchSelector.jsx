import {
  GitBranch,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../../context/useAuth";

function BranchSelector() {
  const { user } = useAuth();
  const branchName = user?.organization?.branchName || "Branch";
  const branchLogo = user?.organization?.branchLogo?.trim();

  return (
    <div className="header-selector-wrapper">

      <button
        type="button"
        className="header-selector"
      >

        <span className="header-selector-icon">
          {branchLogo ? (
            <img
              className="header-selector-logo"
              src={branchLogo}
              alt={`${branchName} logo`}
            />
          ) : (
            <GitBranch size={17} />
          )}
        </span>

        <span className="header-selector-content">

          <span className="header-selector-label">
            Branch
          </span>

          <span className="header-selector-value">
            {branchName}
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

export default BranchSelector;