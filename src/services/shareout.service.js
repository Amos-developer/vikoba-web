import api from "./api";
export const getShareouts=()=>api.get('/shareouts');
export const requestShareoutPayment=id=>api.post(`/shareouts/${id}/request-payment`);
