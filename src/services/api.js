import axios from "axios";
import { apiErrorMessage, errorAlert, successAlert } from "./alert.service.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toUpperCase();
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method) && response.config.showSuccessAlert !== false) {
      successAlert(response.data?.message || "Completed successfully.");
    }
    return response;
  },
  (error) => {
    if (error.config?.showErrorAlert !== false) errorAlert(apiErrorMessage(error));
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("session_expires_at");
      localStorage.removeItem("session_last_activity");
      window.dispatchEvent(new Event("session-expired"));

      if (window.location.pathname !== "/sign-in") {
        window.location.replace("/sign-in?reason=session_expired");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
