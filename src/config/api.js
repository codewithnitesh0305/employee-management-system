export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

const apiPath = (path) =>
  API_BASE_URL.replace(/\/+$/, "") === "/api"
    ? path.replace(/^\/api(?=\/)/, "")
    : path;

export const API_ENDPOINTS = Object.freeze({
  auth: {
    login: "/auth/api/login",
    logout: "/logout",
  },
  employees: {
    collection: "/employees",
    byId: (id) => `/employees/${encodeURIComponent(id)}`,
    profileImage: (id) =>
      `/employees/${encodeURIComponent(id)}/profile-image`,
  },
  employeeInformation: {
    autoNumberScheme: apiPath(
      "/api/employee-information/auto-number-scheme",
    ),
  },
  organizations: {
    collection: apiPath("/api/organization"),
    byId: (id) =>
      apiPath(`/api/organization/${encodeURIComponent(id)}`),
  },
  common: {
    statesByCountry: (countryId) =>
      apiPath(`/api/common-api/states/${encodeURIComponent(countryId)}`),
    citiesByState: (stateId) =>
      apiPath(`/api/common-api/cities/${encodeURIComponent(stateId)}`),
  },
  organizationSetup: {
    department: apiPath("/api/organization/department"),
    designation: apiPath("/api/organization/designation"),
    religion: apiPath("/api/organization/religion"),
    caste: apiPath("/api/organization/caste"),
    salutation: apiPath("/api/organization/salutation"),
    gender: apiPath("/api/organization/gender"),
    qualification: apiPath("/api/organization/qualification"),
    profession: apiPath("/api/organization/profession"),
  },
});
