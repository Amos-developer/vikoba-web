import api from "./api";

export const getMembers = () => {
  return api.get("/members");
};

export const createMember = (payload) => {
  return api.post("/members", payload);
};

export const updateMember = (id, payload) => {
  return api.patch(`/members/${id}`, payload);
};

export const deleteMember = (id) => {
  return api.delete(`/members/${id}`);
};
