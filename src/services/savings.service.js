import api from "./api";

export const getSavings = () => {
  return api.get("/savings");
};

export const createSaving = (payload) => {
  return api.post("/savings", payload);
};

export const updateSaving = (id, payload) => {
  return api.patch(`/savings/${id}`, payload);
};

export const deleteSaving = (id) => {
  return api.delete(`/savings/${id}`);
};
