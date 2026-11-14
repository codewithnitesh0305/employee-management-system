import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../../config/api";

function getEndpoint(type) {
  const endpoint = API_ENDPOINTS.organizationSetup[type];

  if (!endpoint) {
    throw new Error(`No organization setup API is configured for "${type}".`);
  }

  return endpoint;
}

export const organizationSetupApi = {
  getAll: (type, fts = "") =>
    apiClient.get(getEndpoint(type), { params: { fts } }),

  save: (type, { id = null, name }) =>
    apiClient.post(getEndpoint(type), { id, name }),

  delete: (type, ids) =>
    apiClient.delete(getEndpoint(type), {
      params: { ids: Array.isArray(ids) ? ids.join(",") : ids },
    }),

  updateStatus: (type, id, isActive) =>
    apiClient.patch(getEndpoint(type), null, {
      params: { id, isActive },
    }),
};
