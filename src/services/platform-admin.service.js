import axios from "axios";
import { apiErrorMessage,errorAlert,successAlert } from "./alert.service.js";

const platformApi=axios.create({baseURL:`${import.meta.env.VITE_API_URL||"http://localhost:3000/api"}/platform`});
platformApi.interceptors.request.use(config=>{const token=localStorage.getItem("platform_staff_token");if(token)config.headers.Authorization=`Bearer ${token}`;return config;});
platformApi.interceptors.response.use(response=>{if(["POST","PUT","PATCH","DELETE"].includes(response.config.method?.toUpperCase()))successAlert(response.data?.message||"Completed successfully.");return response;},error=>{errorAlert(apiErrorMessage(error));if(error.response?.status===401&&error.config?.url!=="/login"){localStorage.removeItem("platform_staff_token");localStorage.removeItem("platform_staff");window.dispatchEvent(new Event("platform-session-expired"));}return Promise.reject(error);});

export const platformLogin=data=>platformApi.post("/login",data);
export const platformLogout=()=>platformApi.post("/logout");
export const getPlatformStaff=()=>platformApi.get("/staff");
export const getPlatformAudit=()=>platformApi.get("/audit");
export const getPlatformOverview=()=>platformApi.get("/overview");
export const getPlatformOrganizations=()=>platformApi.get("/organizations");
export const getPlatformSubscriptions=()=>platformApi.get("/subscriptions");
export const getPlatformPayments=()=>platformApi.get("/payments");
export const getPlatformInvoices=()=>platformApi.get("/invoices");
export const createPlatformStaff=data=>platformApi.post("/staff",data);
export const updatePlatformStaff=(id,data)=>platformApi.put(`/staff/${id}`,data);
export const resetPlatformStaffPassword=(id,password)=>platformApi.patch(`/staff/${id}/password`,{password});
export const updateOrganizationAccess=(id,data)=>platformApi.patch(`/organizations/${id}/access`,data);
export const updateSubscriptionControl=(organizationId,data)=>platformApi.patch(`/subscriptions/${organizationId}`,data);
