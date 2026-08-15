import api from "./api";

export const login = (data) => {
  return api.post("/auth/login", data);
};

export const updateLanguage = (language) => api.patch("/auth/language", { language });
