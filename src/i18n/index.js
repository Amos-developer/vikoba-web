import { ref } from "vue";

export const language = ref(localStorage.getItem("app_language") || "en");

const phrases = {
  "Group Finance Platform": "Mfumo wa Fedha za Kikundi",
  "Management Platform": "Mfumo wa Usimamizi",
  "Built for accountable groups": "Umeundwa kwa vikundi vinavyowajibika",
  "One clear view of your group finances.": "Mwonekano mmoja wazi wa fedha za kikundi chako.",
  "Manage savings, loans, repayments, meetings, and approvals from a secure shared workspace.": "Simamia akiba, mikopo, marejesho, mikutano na idhini katika mazingira salama ya pamoja.",
  "Controlled access": "Ufikiaji unaodhibitiwa",
  "Role-based permissions and approvals": "Ruhusa na idhini kulingana na majukumu",
  "Complete audit trail": "Historia kamili ya ukaguzi",
  "Every financial movement stays traceable": "Kila muamala wa fedha unaweza kufuatiliwa",
  "Secure group administration": "Usimamizi salama wa kikundi",
  "Welcome back": "Karibu tena",
  "Sign in to your account": "Ingia kwenye akaunti yako",
  "Enter your account details to continue.": "Weka taarifa za akaunti yako ili kuendelea.",
  "Email address": "Anwani ya barua pepe",
  "Enter your password": "Weka nenosiri lako",
  "Signing in...": "Inaingia...",
  "Sign in": "Ingia",
  "Having trouble signing in? Contact your group administrator.": "Una tatizo la kuingia? Wasiliana na msimamizi wa kikundi.",
  "Your session expired. Sign in again to continue.": "Kikao chako kimeisha. Ingia tena ili kuendelea.",
  "You were signed out after a period of inactivity.": "Umetolewa baada ya kutotumia mfumo kwa muda.",
  "You have been signed out securely.": "Umetoka salama.",
  "Enter your email address and password.": "Weka anwani ya barua pepe na nenosiri.",
  "The email or password is incorrect.": "Barua pepe au nenosiri si sahihi.",
  "Invalid credentials": "Taarifa za kuingia si sahihi",
  "This account has been deactivated": "Akaunti hii imesitishwa",
  "Language must be English or Swahili": "Lugha lazima iwe Kiingereza au Kiswahili",
  "Financial Cycles": "Mizunguko ya Fedha",
  "Shares / Hisa": "Hisa",
  "Social Fund": "Mfuko wa Jamii",
  "Users & Approvals": "Watumiaji na Idhini",
  "Audit Logs": "Kumbukumbu za Ukaguzi",
  "Share-out": "Mgawanyo",
  "Loan disbursement": "Utoaji wa mkopo",
  "Social-fund payment": "Malipo ya mfuko wa jamii",
  "Social-fund support": "Msaada wa mfuko wa jamii",
  "Social-fund contribution": "Mchango wa mfuko wa jamii",
  "Other income": "Mapato mengine",
  "No matching audit events.": "Hakuna matukio ya ukaguzi yanayolingana.",
  "No records found.": "Hakuna rekodi zilizopatikana.",
  "Showing": "Inaonyesha",
  "No.": "Na.",
};

const terms = {
  Dashboard:"Dashibodi", Members:"Wanachama", Member:"Mwanachama", Meetings:"Mikutano", Meeting:"Mkutano",
  Savings:"Akiba", Saving:"Akiba", Loans:"Mikopo", Loan:"Mkopo", Repayments:"Marejesho", Repayment:"Marejesho",
  Penalties:"Adhabu", Penalty:"Adhabu", Transactions:"Miamala", Transaction:"Muamala", Expenses:"Matumizi", Expense:"Matumizi",
  Income:"Mapato", Reports:"Ripoti", Report:"Ripoti", Shares:"Hisa", Share:"Hisa", Users:"Watumiaji", User:"Mtumiaji",
  Approvals:"Idhini", Approval:"Idhini", Attendance:"Mahudhurio", Contributions:"Michango", Contribution:"Mchango",
  Overview:"Muhtasari", Workspace:"Eneo la kazi", Search:"Tafuta", Refresh:"Onyesha upya", Logout:"Toka", Administrator:"Msimamizi",
  Language:"Lugha", English:"Kiingereza", Swahili:"Kiswahili", Name:"Jina", Phone:"Simu", Email:"Barua pepe", Password:"Nenosiri",
  Date:"Tarehe", Time:"Muda", Amount:"Kiasi", Balance:"Salio", Status:"Hali", Action:"Kitendo", Actions:"Vitendo",
  Description:"Maelezo", Reference:"Rejea", Category:"Aina", Type:"Aina", Direction:"Mwelekeo", Details:"Maelezo",
  Total:"Jumla", Active:"Hai", Inactive:"Isiyotumika", Pending:"Inasubiri", Approved:"Imeidhinishwa", Rejected:"Imekataliwa",
  Completed:"Imekamilika", Closed:"Imefungwa", Open:"Fungua", Close:"Funga", Cancel:"Ghairi", Save:"Hifadhi", Saving:"Inahifadhi",
  Submit:"Wasilisha", Add:"Ongeza", Create:"Unda", Edit:"Hariri", Delete:"Futa", Update:"Sasisha", View:"Tazama", Review:"Kagua",
  Approve:"Idhinisha", Reject:"Kataa", Record:"Rekodi", Generate:"Tengeneza", Apply:"Tumia", Clear:"Futa", Filter:"Chuja",
  All:"Zote", New:"Mpya", Current:"Sasa", Previous:"Iliyopita", Next:"Inayofuata", First:"Kwanza", Last:"Mwisho",
  From:"Kuanzia", To:"Hadi", Today:"Leo", Monthly:"Kila mwezi", Cycle:"Mzunguko", Financial:"Fedha", Period:"Kipindi",
  Start:"Anza", End:"Mwisho", Closing:"Kufunga", Profit:"Faida", Distribution:"Mgawanyo", Payment:"Malipo", Paid:"Imelipwa",
  Withdrawal:"Utoaji", Fine:"Faini", Interest:"Riba", Service:"Huduma", Charges:"Tozo", Cash:"Fedha taslimu", Fund:"Mfuko",
  Support:"Msaada", Emergency:"Dharura", Sickness:"Ugonjwa", Funeral:"Msiba", Beneficiary:"Mnufaika", Purpose:"Kusudi",
  Agenda:"Ajenda", Decisions:"Maamuzi", Decision:"Uamuzi", Absent:"Hayupo", Present:"Yupo", Late:"Amechelewa",
  Role:"Jukumu", Access:"Ufikiaji", Security:"Usalama", Accountability:"Uwajibikaji", Settings:"Mipangilio",
  Loading:"Inapakia", Unable:"Imeshindikana", Error:"Hitilafu", Success:"Imefanikiwa", Required:"Inahitajika", Optional:"Si lazima",
  Yes:"Ndiyo", No:"Hapana", Notes:"Maelezo", Note:"Dokezo", Price:"Bei", Value:"Thamani", Number:"Idadi",
  History:"Historia", Summary:"Muhtasari", Statement:"Taarifa", Outstanding:"Haijalipwa", Movement:"Muamala", Account:"Akaunti",
  Recorded:"Imerekodiwa", Requested:"Imeombwa", Created:"Imeundwa", Updated:"Imesasishwa", Deleted:"Imefutwa",
  by:"na", of:"ya", for:"kwa", and:"na", or:"au", with:"na", without:"bila", per:"kwa", is:"ni", are:"ni",
};

const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const replacements = [
  ...Object.entries(phrases),
  ...Object.entries(terms),
].sort(([a], [b]) => b.length - a.length);

export const translate = (value) => {
  if (language.value !== "sw" || typeof value !== "string") return value;
  let translated = value;
  replacements.forEach(([english, swahili]) => {
    const startBoundary = /^\w/.test(english) ? "\\b" : "";
    const endBoundary = /\w$/.test(english) ? "\\b" : "";
    translated = translated.replace(new RegExp(`${startBoundary}${escape(english)}${endBoundary}`, "gi"), swahili);
  });
  return translated;
};

export const setLanguage = (value) => {
  language.value = value === "sw" ? "sw" : "en";
  localStorage.setItem("app_language", language.value);
  document.documentElement.lang = language.value;
  window.dispatchEvent(new CustomEvent("app-language-change"));
};

const textStates = new WeakMap();
const attributeStates = new WeakMap();
const attributes = ["placeholder", "title", "aria-label"];

const localizeText = (node) => {
  if (!node.nodeValue?.trim() || ["SCRIPT", "STYLE", "CODE"].includes(node.parentElement?.tagName)) return;
  let state = textStates.get(node) || { original: node.nodeValue, translated: "" };
  if (language.value === "sw" && node.nodeValue !== state.translated && node.nodeValue !== state.original) state.original = node.nodeValue;
  const next = language.value === "sw" ? translate(state.original) : state.original;
  state.translated = next;
  textStates.set(node, state);
  if (node.nodeValue !== next) node.nodeValue = next;
};

const localizeElement = (element) => {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) localizeText(walker.currentNode);
  [element, ...element.querySelectorAll("*")].forEach((child) => {
    let states = attributeStates.get(child) || {};
    attributes.forEach((attribute) => {
      if (!child.hasAttribute(attribute)) return;
      const current = child.getAttribute(attribute);
      const state = states[attribute] || { original: current, translated: "" };
      if (language.value === "sw" && current !== state.translated && current !== state.original) state.original = current;
      const next = language.value === "sw" ? translate(state.original) : state.original;
      state.translated = next; states[attribute] = state;
      if (current !== next) child.setAttribute(attribute, next);
    });
    attributeStates.set(child, states);
  });
};

export const initializeLocalization = (root = document.body) => {
  document.documentElement.lang = language.value;
  localizeElement(root);
  const observer = new MutationObserver((mutations) => mutations.forEach((mutation) => {
    if (mutation.type === "characterData") localizeText(mutation.target);
    mutation.addedNodes?.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) localizeText(node);
      else if (node instanceof Element) localizeElement(node);
    });
  }));
  observer.observe(root, { childList: true, subtree: true, characterData: true });
  window.addEventListener("app-language-change", () => localizeElement(root));
  return observer;
};
