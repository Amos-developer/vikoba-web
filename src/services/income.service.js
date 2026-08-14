import api from './api';
export const getIncome=()=>api.get('/income');
export const createIncome=payload=>api.post('/income',payload);
