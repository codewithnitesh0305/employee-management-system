import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../../config/api";

export const employeeApi = {
  getEmployees: (params) =>
    apiClient.get(API_ENDPOINTS.employees.collection, { params }),
  getEmployeeById: (id) =>
    apiClient.get(API_ENDPOINTS.employees.byId(id)),
  createEmployee: (data) =>
    apiClient.post(API_ENDPOINTS.employees.collection, data),
  updateEmployee: (id, data) =>
    apiClient.put(API_ENDPOINTS.employees.byId(id), data),
  deleteEmployee: (id) =>
    apiClient.delete(API_ENDPOINTS.employees.byId(id)),
  uploadProfileImage: (id, formData) =>
    apiClient.post(API_ENDPOINTS.employees.profileImage(id), formData),
};
