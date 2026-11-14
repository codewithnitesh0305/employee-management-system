import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config/api";
import { authStorage } from "../auth/authStorage";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = authStorage.getToken();

  if (token && config.url !== API_ENDPOINTS.auth.login) {
    config.headers.set("Authorization", `Bearer ${token}`);

    if (config.url !== API_ENDPOINTS.auth.logout) {
      const user = authStorage.getUser();
      const branchId = user?.organization?.branchId;
      const employeeId = user?.employeeId;

      if (branchId !== undefined && branchId !== null) {
        config.headers.set("branchId", String(branchId));
      }

      if (employeeId !== undefined && employeeId !== null) {
        config.headers.set("employeeId", String(employeeId));
      }
    }
  }

  if (config.data instanceof FormData) {
    config.headers.delete("Content-Type");
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url;
    const isAuthRequest = [
      API_ENDPOINTS.auth.login,
      API_ENDPOINTS.auth.logout,
    ].includes(requestUrl);
    const isOnLoginPage = window.location.pathname === "/login";

    if (
      error.response?.status === 401 &&
      authStorage.getToken() &&
      !isAuthRequest &&
      !isOnLoginPage
    ) {
      authStorage.clearAuth();
      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
