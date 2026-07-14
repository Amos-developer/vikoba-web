import api from "./api";

export const getLoans = () => {
  return api.get("/loans");
};
