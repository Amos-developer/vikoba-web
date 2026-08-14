import api from "./api";

export const getUsers = () => api.get("/users");
export const createUser = (payload) => api.post("/users", payload);
export const updateUser = (id, payload) => api.patch(`/users/${id}`, payload);
export const getApprovals = (status = "") => api.get("/approvals", { params: status ? { status } : {} });
export const reviewApproval = (id, payload) => api.patch(`/approvals/${id}/review`, payload);


