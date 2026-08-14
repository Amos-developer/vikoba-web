import api from "./api";

export const getCycles = () => api.get("/cycles");
export const createCycle = (payload) => api.post("/cycles", payload);
export const activateCycle = (id) => api.patch(`/cycles/${id}/activate`);
export const closeCycle = (id, payload) => api.patch(`/cycles/${id}/close`, payload);
