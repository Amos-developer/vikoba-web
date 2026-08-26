import { errorAlert } from "../services/alert.service.js";

export const TANZANIA_PHONE_PATTERN = "\\+255[67][0-9]{8}";
export const TANZANIA_PHONE_MESSAGE = "Phone must start with +255 and contain 9 valid mobile digits, for example +255712345678.";
export const normalizeTanzanianPhone = (value) => String(value ?? "").trim().replace(/[\s()-]/g, "");
export const isValidTanzanianPhone = (value) => /^\+255[67]\d{8}$/.test(normalizeTanzanianPhone(value));
export const validatePhoneElement = (event, optional = false) => {
  const input=event.target;const normalized=normalizeTanzanianPhone(input.value);
  const valid=optional&&!normalized?true:isValidTanzanianPhone(normalized);
  input.setCustomValidity(valid?"":TANZANIA_PHONE_MESSAGE);
  if(valid&&normalized)input.value=normalized;
};
export const initializeFormValidation = () => {
  document.addEventListener("invalid",event=>{const field=event.target;if(field instanceof HTMLInputElement||field instanceof HTMLSelectElement||field instanceof HTMLTextAreaElement)errorAlert(field.validationMessage||"Check the highlighted field and try again.");},true);
  document.addEventListener("change",event=>{const field=event.target;if((field instanceof HTMLInputElement||field instanceof HTMLTextAreaElement)&&["text","email","tel","search",""].includes(field.type))field.value=field.value.trim();},true);
};
