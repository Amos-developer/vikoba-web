import api from "./api";

export const getSocialFund = () => api.get("/social-fund");
export const createSocialFundEntry = (payload) => api.post("/social-fund", payload);
