import api from "./api";

export const getDashboardStats = () => {
  return api.get("/dashboard/stats");
};

export const getRecentMembers = () => {
  return api.get(
    "/dashboard/recent-members"
  );
};

export const getRecentTransactions = () => {
  return api.get(
    "/dashboard/recent-transactions"
  );
};