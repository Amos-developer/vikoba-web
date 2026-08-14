import api from "./api";

export const getPenalties = () => api.get("/penalties");
export const createPenalty = (payload) => api.post("/penalties", payload);
export const updatePenalty = (id, payload) => api.patch(`/penalties/${id}`, payload);
export const deletePenalty = (id) => api.delete(`/penalties/${id}`);


