import axios from "axios";

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
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("session_expires_at");
      localStorage.removeItem("session_last_activity");
      window.dispatchEvent(new Event("session-expired"));

      if (window.location.pathname !== "/login") {
        window.location.replace("/login?reason=session_expired");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
