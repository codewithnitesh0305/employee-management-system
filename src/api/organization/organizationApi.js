import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../../config/api";

export const organizationApi = {
  getOrganizations: (params) =>
    apiClient.get(API_ENDPOINTS.organizations.collection, { params }),
  getOrganizationById: (id) =>
    apiClient.get(API_ENDPOINTS.organizations.byId(id)),
  saveUpdateOrganization: (formData) =>
    apiClient.post(API_ENDPOINTS.organizations.collection, formData),
  getStatesByCountry: (countryId) =>
    apiClient.get(API_ENDPOINTS.common.statesByCountry(countryId)),
  getCitiesByState: (stateId) =>
    apiClient.get(API_ENDPOINTS.common.citiesByState(stateId)),
};
