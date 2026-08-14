import api from "./api";

export const getRepayments = () => api.get("/repayments");
export const createRepayment = (payload) => api.post("/repayments", payload);


