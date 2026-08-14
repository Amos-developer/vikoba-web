import api from "./api";

export const getMeetings = () => api.get("/meetings");
export const createMeeting = (payload) => api.post("/meetings", payload);
export const updateMeeting = (id, payload) => api.patch(`/meetings/${id}`, payload);
export const deleteMeeting = (id) => api.delete(`/meetings/${id}`);


