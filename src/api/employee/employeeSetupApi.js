import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../../config/api";

const endpoint = API_ENDPOINTS.employeeInformation.autoNumberScheme;

export const employeeSetupApi = {
  getAutoNumberSchemes: (params) => apiClient.get(endpoint, { params }),
  saveAutoNumberScheme: (data) => apiClient.post(endpoint, data),
  updateAutoNumberSchemeStatus: (data) => apiClient.put(endpoint, data),
  deleteAutoNumberScheme: (id) =>
    apiClient.delete(endpoint, { params: { id } }),
};
