import {
  LayoutDashboard,
  BriefcaseBusiness,
  UserRoundCheck,
  MessageSquare,
  Settings,
} from "lucide-react";

const menuConfig = [
  // =====================================================
  // DASHBOARD
  // =====================================================

  {
    type: "item",
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },

  // =====================================================
  // EMPLOYEE MANAGEMENT
  // =====================================================

  {
    type: "group",
    label: "Employee Management",
    icon: BriefcaseBusiness,

    children: [
      {
        label: "Add Employee",
        path: "/employee-information/addEmployee",
      },

      {
        label: "Employee List",
        path: "/employee-information/employeeslist",
      },

      {
        label: "Inactive Employee",
        path: "/employee-information/employees/inactive",
      },
      {
        label: "Employee Document",
        path: "/employee-information/documents",
      },

      {
        label: "Employee Data Port",
        path: "/employee-information/data-port",
      },

      {
        label: "Employee Advance Search",
        path: "/employee-information/advance-search",
      },

      // ==========================
      // REPORT
      // ==========================

      {
        label: "Report",
        path: "/employee-information/reports",
        hasChildren: true,

        children: [
          {
            label: "Employee Report",
            path: "/employee-information/reports/employees",
          },

          {
            label: "Department Report",
            path: "/employee-information/reports/departments",
          },

          {
            label: "Designation Report",
            path: "/employee-information/reports/designations",
          },
        ],
      },

      {
        label: "Setup",
        path: "/employee-information/setup",
      },
    ],
  },

  // =====================================================
  // EMPLOYEE ATTENDANCE
  // =====================================================

  {
    type: "group",
    label: "Employee Attendance",
    icon: UserRoundCheck,

    children: [
      {
        label: "Attendance",
        path: "/attendance",
      },

      {
        label: "Attendance Register",
        path: "/attendance/register",
      },

      {
        label: "Leave Management",
        path: "/attendance/leave",
      },

      {
        label: "Holidays",
        path: "/attendance/holidays",
      },

      {
        label: "Shift Management",
        path: "/attendance/shifts",
      },

      // ==========================
      // REPORT
      // ==========================

      {
        label: "Report",
        path: "/attendance/reports",
        hasChildren: true,

        children: [
          {
            label: "Attendance Report",
            path: "/attendance/reports/attendance",
          },

          {
            label: "Leave Report",
            path: "/attendance/reports/leave",
          },
        ],
      },

      {
        label: "Setup",
        path: "/attendance/setup",
      },
    ],
  },

  // =====================================================
  // COMMUNICATION
  // =====================================================

  {
    type: "group",
    label: "Communication",
    icon: MessageSquare,

    children: [
      {
        label: "Announcements",
        path: "/communication/announcements",
      },

      {
        label: "Messages",
        path: "/communication/messages",
      },

      {
        label: "Meetings",
        path: "/communication/meetings",
      },

      {
        label: "Feedback",
        path: "/communication/feedback",
      },

      {
        label: "Setup",
        path: "/communication/setup",
      },
    ],
  },

  // =====================================================
  // CONFIGURATION
  // =====================================================

  {
    type: "group",
    label: "Configuration",
    icon: Settings,

    children: [
      {
        label: "Organization",
        path: "/configuration/organization",
      },

      {
        label: "Branches",
        path: "/configuration/branches",
      },

      {
        label: "Financial Years",
        path: "/configuration/financial-years",
      },

      {
        label: "Departments",
        path: "/configuration/departments",
      },

      {
        label: "Designations",
        path: "/configuration/designations",
      },

      {
        label: "Employee Types",
        path: "/configuration/employee-types",
      },

      {
        label: "Employment Types",
        path: "/configuration/employment-types",
      },

      {
        label: "Pay Grades",
        path: "/configuration/pay-grades",
      },

      {
        label: "Setup",
        path: "/configuration/setup",
      },
    ],
  },
];

export default menuConfig;