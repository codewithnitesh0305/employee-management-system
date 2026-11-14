import {
  FileText,
  Hash,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import "./EmployeeSetup.css";

const EMPLOYEE_SETUP_ITEMS = [
  {
    icon: Hash,
    title: "Auto Number Scheme",
    description:
      "Configure the numbering format used to generate employee IDs.",
    to: "/employee-information/setup/auto-number-scheme",
  },
  {
    icon: UsersRound,
    title: "Employee Type",
    description:
      "Manage employee types used when adding and organizing employees.",
  },
  {
    icon: FileText,
    title: "Document",
    description:
      "Set up the document types required for employee records.",
  },
];

function EmployeeSetup() {
  return (
    <div className="employee-setup-page">
      {/* <Breadcrumb
        items={[
          { label: "Employee Management", path: "/employee-information/employeeslist" },
          { label: "Setup" },
        ]}
      /> */}

      <section className="employee-setup-panel" aria-label="Employee Setup">
        <div className="employee-setup-section">
          <div className="employee-setup-section-band">Employee Setup</div>
          <div className="employee-setup-card-grid">
            {EMPLOYEE_SETUP_ITEMS.map(({ icon: Icon, title, description, to }) => {
              const content = (
                <>
                  <span className="employee-setup-card-icon">
                    <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="employee-setup-card-content">
                    <span className="employee-setup-card-title">{title}</span>
                    <span className="employee-setup-card-description">
                      {description}
                    </span>
                  </span>
                </>
              );

              return to ? (
                <Link
                  className="employee-setup-card is-clickable"
                  key={title}
                  to={to}
                >
                  {content}
                </Link>
              ) : (
                <article className="employee-setup-card" key={title}>
                  {content}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default EmployeeSetup;
