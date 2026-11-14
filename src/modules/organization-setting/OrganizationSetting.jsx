import { Link } from "react-router-dom";

import {
  ChevronLeft,
  Building2,
  Palette,
  IdCard,
  Network,
  Church,
  Users,
  Contact,
  VenusAndMars,
  ScrollText,
  UserRoundCog,
} from "lucide-react";

import SettingCard from "../../components/common/SettingCard/SettingCard";

import "./OrganizationSetting.css";

const SECTIONS = [
  {
    id: "organization-setup",
    label: "Organization Setup",

    items: [
      {
        icon: Building2,
        title: "Organization Details",
        description:
          "Manage your organization's core information, including name, contact details, logo, and affiliation information.",
        to: "/organization-settings/details",
      },
      {
        icon: Palette,
        title: "Appearance",
        description:
          "Customize your portal's theme, logo, and colors to match your institution's brand identity.",
        to: "/organization-settings/appearance",
      },
    ],
  },

  {
    id: "employee-setup",
    label: "Employee Setup",

    items: [
      {
        icon: IdCard,
        title: "Designation",
        description:
          "Establish employee titles and hierarchies for efficient employee management.",
        to: "/organization-settings/designation",
      },
      {
        icon: Network,
        title: "Department",
        description:
          "Organize teams and divisions for structured employee management.",
        to: "/organization-settings/department",
      },
    ],
  },

  {
    id: "other-setup",
    label: "Other Setup",

    items: [
      {
        icon: Church,
        title: "Religion",
        description:
          "Configure and manage religion categories to align with your institution's demographic requirements.",
        to: "/organization-settings/religion",
      },
      {
        icon: Users,
        title: "Caste",
        description:
          "Set up caste classifications to ensure accurate record-keeping and compliance with institutional policies.",
        to: "/organization-settings/caste",
      },
      {
        icon: Contact,
        title: "Salutation",
        description:
          "Define standard salutations and honorifics used across all communication and reports.",
        to: "/organization-settings/salutation",
      },
      {
        icon: VenusAndMars,
        title: "Gender",
        description:
          "Manage gender options and configurations to maintain inclusive and accurate records.",
        to: "/organization-settings/gender",
      },
      {
        icon: ScrollText,
        title: "Qualification",
        description:
          "Define staff qualification parameters for precise teacher mapping and analytics.",
        to: "/organization-settings/qualification",
      },
      {
        icon: UserRoundCog,
        title: "Profession",
        description:
          "Manage profession or designation details to streamline staff categorization and reporting.",
        to: "/organization-settings/profession",
      },
    ],
  },
];

function OrganizationSettings() {
  return (
    <div className="org-page">

      <h1 className="org-page-title">
        Organization Settings
      </h1>

      <div className="org-panel">

        {/* Header */}

        <div className="org-panel-header">

          <div>
            <h2 className="org-panel-heading">
              Set up your organization profile
            </h2>

            <p className="org-panel-subheading">
              Set up your school's core structure including
              classes, subjects &amp; staff details for efficient
              data management.
            </p>
          </div>

          <Link
            to="/employee-information/employeeslist"
            className="org-back-link"
          >
            <ChevronLeft size={16} />

            <ChevronLeft
              size={16}
              className="org-back-link-overlap"
            />

            <span>
              Back to Dashboard
            </span>
          </Link>

        </div>

        {/* Settings Sections */}

        {SECTIONS.map((section) => (
          <div
            key={section.id}
            className="org-section"
          >

            <div className="org-section-band">
              {section.label}
            </div>

            <div className="org-card-grid">

              {section.items.map((item) => (
                <SettingCard
                  key={item.title}
                  {...item}
                />
              ))}

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default OrganizationSettings;