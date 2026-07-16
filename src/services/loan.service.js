import api from "./api";

export const getLoans = () => {
  return api.get("/loans");
};

export const createLoan = (payload) => {
  return api.post("/loans", payload);
};

export const updateLoan = (id, payload) => {
  return api.patch(`/loans/${id}`, payload);
};

export const deleteLoan = (id) => {
  return api.delete(`/loans/${id}`);
};

export const approveLoan = (id) => {
  return api.patch(`/loans/${id}/approve`);
};
