import api from "./api.js";
export const getPlans=()=>api.get("/billing/plans");
export const getBillingOverview=()=>api.get("/billing/overview");
export const createCheckout=(plan_id)=>api.post("/billing/checkout",{plan_id});
export const cancelSubscription=()=>api.post("/billing/cancel");
export const startTrial=(payload)=>api.post("/auth/trial",payload);
