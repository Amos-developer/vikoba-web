import api from "./api";
export const getExpenses = () => api.get("/expenses");
export const createExpense = (payload) => api.post("/expenses", payload);
