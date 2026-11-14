import axiosInstance from "./axiosInstance";

export const apiClient = {
  get: async (url, config) =>
    (await axiosInstance.get(url, config)).data,
  post: async (url, data, config) =>
    (await axiosInstance.post(url, data, config)).data,
  put: async (url, data, config) =>
    (await axiosInstance.put(url, data, config)).data,
  patch: async (url, data, config) =>
    (await axiosInstance.patch(url, data, config)).data,
  delete: async (url, config) =>
    (await axiosInstance.delete(url, config)).data,
};
