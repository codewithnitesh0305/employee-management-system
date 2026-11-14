import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../../config/api";

export const authApi = {
  login: (credentials) =>
    apiClient.post(API_ENDPOINTS.auth.login, credentials),
  logout: () => apiClient.post(API_ENDPOINTS.auth.logout),
};
