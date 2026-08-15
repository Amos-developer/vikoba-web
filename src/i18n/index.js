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
  "Access and financial controls": "Ufikiaji na udhibiti wa fedha",
  "Administration": "Utawala",
  "Users, roles & approvals": "Watumiaji, majukumu na idhini",
  "Manage access and enforce two-person review for sensitive financial actions.": "Simamia ufikiaji na utekeleze ukaguzi wa watu wawili kwa vitendo nyeti vya kifedha.",
  "Add user": "Ongeza mtumiaji",
  "Users & roles": "Watumiaji na majukumu",
  "request was": "ombi liliwasilishwa",
  "requests were": "maombi yaliwasilishwa",
  "submitted by you.": "na wewe.",
  "A different Admin, Chairperson, or Treasurer must review": "Msimamizi, Mwenyekiti au Mweka hazina mwingine lazima akague",
  "Financial approval queue": "Foleni ya idhini za kifedha",
  "Requesters cannot review their own requests.": "Waombaji hawawezi kukagua maombi yao wenyewe.",
  "All requests": "Maombi yote",
  "Requested by": "Imeombwa na",
  "Loading requests...": "Inapakia maombi...",
  "No approval requests found.": "Hakuna maombi ya idhini yaliyopatikana.",
  "Application users": "Watumiaji wa mfumo",
  "Admins inherit every role permission.": "Wasimamizi wana ruhusa za majukumu yote.",
  "Loading users...": "Inapakia watumiaji...",
  "New account": "Akaunti mpya",
  "Add application user": "Ongeza mtumiaji wa mfumo",
  "Full name": "Jina kamili",
  "Creating...": "Inaunda...",
  "Create user": "Unda mtumiaji",
  "Financial control": "Udhibiti wa fedha",
  "Approve request": "Idhinisha ombi",
  "Reject request": "Kataa ombi",
  "requested by": "imeombwa na",
  "Review note": "Dokezo la ukaguzi",
  "Add context for the audit trail": "Ongeza maelezo kwa historia ya ukaguzi",
  "Penalty waiver": "Msamaha wa adhabu",
  "Share-out payment": "Malipo ya mgawanyo",
  "Unable to load access management.": "Imeshindikana kupakia usimamizi wa ufikiaji.",
  "User account created.": "Akaunti ya mtumiaji imeundwa.",
  "Unable to create user.": "Imeshindikana kuunda mtumiaji.",
  "User role updated.": "Jukumu la mtumiaji limesasishwa.",
  "Unable to update role.": "Imeshindikana kusasisha jukumu.",
  "Unable to update user.": "Imeshindikana kusasisha mtumiaji.",
  "Unable to review request.": "Imeshindikana kukagua ombi.",
  "Request approved.": "Ombi limeidhinishwa.",
  "Request rejected.": "Ombi limekataliwa.",
  "Approve and disburse loan": "Idhinisha na toa mkopo",
  "Financial reporting": "Taarifa za kifedha",
  "Reporting centre": "Kituo cha ripoti",
  "Generate consistent financial and member reports from live records.": "Tengeneza ripoti thabiti za kifedha na wanachama kutoka kwenye rekodi halisi.",
  "Print": "Chapisha",
  "Export CSV": "Hamisha CSV",
  "All members": "Wanachama wote",
  "Report types": "Aina za ripoti",
  "Member statement": "Taarifa ya mwanachama",
  "Outstanding loans": "Mikopo ambayo haijalipwa",
  "Income / expense": "Mapato / matumizi",
  "Cash position": "Hali ya fedha taslimu",
  "End of cycle": "Mwisho wa mzunguko",
  "Vikoba financial report": "Ripoti ya kifedha ya Vikoba",
  "Beginning": "Mwanzo",
  "Generating report...": "Inatengeneza ripoti...",
  "Total inflows": "Jumla ya fedha zilizoingia",
  "Total outflows": "Jumla ya fedha zilizotoka",
  "Current cash position": "Hali ya sasa ya fedha taslimu",
  "Total savings": "Jumla ya akiba",
  "Loan repayments": "Marejesho ya mikopo",
  "Loan disbursements": "Mikopo iliyotolewa",
  "Fines collected": "Faini zilizokusanywa",
  "Closing cash": "Fedha wakati wa kufunga",
  "Group account": "Akaunti ya kikundi",
  "No statement entries found.": "Hakuna miamala ya taarifa iliyopatikana.",
  "Last contribution": "Mchango wa mwisho",
  "Loan amount": "Kiasi cha mkopo",
  "Total payable": "Jumla inayotakiwa kulipwa",
  "No outstanding loans.": "Hakuna mikopo ambayo haijalipwa.",
  "Remaining": "Iliyobaki",
  "No repayments found.": "Hakuna marejesho yaliyopatikana.",
  "Entries": "Rekodi",
  "No social-fund payments found.": "Hakuna malipo ya mfuko wa jamii yaliyopatikana.",
  "Unable to generate reports.": "Imeshindikana kutengeneza ripoti.",
  "Cycle profit distribution": "Mgawanyo wa faida ya mzunguko",
  "End-of-cycle distribution": "Mgawanyo wa mwisho wa mzunguko",
  "Share-out & profit distribution": "Mgawanyo wa mtaji na faida",
  "Return member savings and Hisa capital, then allocate realized profit according to each member’s combined capital proportion.": "Rudisha akiba na mtaji wa Hisa wa mwanachama, kisha gawanya faida iliyopatikana kulingana na uwiano wa jumla ya mtaji wa kila mwanachama.",
  "All closed cycles": "Mizunguko yote iliyofungwa",
  "Savings + Hisa": "Akiba + Hisa",
  "Allocated profit": "Faida iliyogawiwa",
  "Total distribution": "Jumla ya mgawanyo",
  "Paid out": "Iliyolipwa",
  "How profit is allocated": "Jinsi faida inavyogawanywa",
  "Member profit = distributable profit × ((member savings + Hisa value) ÷ total group capital). Distributable profit includes realized loan interest, fines, and other income, less approved expenses.": "Faida ya mwanachama = faida inayogawanywa × ((akiba ya mwanachama + thamani ya Hisa) ÷ jumla ya mtaji wa kikundi). Faida inayogawanywa inajumuisha riba ya mikopo iliyopatikana, faini na mapato mengine, ukiondoa matumizi yaliyoidhinishwa.",
  "Member distributions": "Migawanyo ya wanachama",
  "Closing snapshots cannot change after a cycle closes.": "Taarifa za kufunga haziwezi kubadilishwa baada ya mzunguko kufungwa.",
  "Share ratio": "Uwiano wa mtaji",
  "Profit share": "Sehemu ya faida",
  "Final share-out": "Mgawanyo wa mwisho",
  "Calculating distributions...": "Inakokotoa migawanyo...",
  "Close a financial cycle to create share-out records.": "Funga mzunguko wa fedha ili kuunda rekodi za mgawanyo.",
  "Awaiting approval": "Inasubiri idhini",
  "Unpaid": "Haijalipwa",
  "Submitting...": "Inawasilisha...",
  "Request payout": "Omba malipo",
  "Payment submitted for approval.": "Malipo yamewasilishwa kwa idhini.",
  "Unable to load share-out records.": "Imeshindikana kupakia rekodi za mgawanyo.",
  "Unable to request payment.": "Imeshindikana kuomba malipo.",
  "Audit Logs": "Kumbukumbu za Ukaguzi",
  "Security and accountability": "Usalama na uwajibikaji",
  "Immutable activity history": "Historia ya shughuli isiyoweza kubadilishwa",
  "Investigate who created, edited, approved, rejected, reversed, or deleted sensitive records.": "Chunguza aliyeunda, kuhariri, kuidhinisha, kukataa, kubatilisha au kufuta rekodi nyeti.",
  "Immutable": "Haibadilishiki",
  "User, action, record, or module": "Mtumiaji, kitendo, rekodi au sehemu",
  "All actions": "Vitendo vyote",
  "All modules": "Sehemu zote",
  "From date": "Tarehe ya kuanzia",
  "To date": "Tarehe ya mwisho",
  "Displayed events": "Matukio yaliyoonyeshwa",
  "Successful": "Yaliyofanikiwa",
  "Failed attempts": "Majaribio yaliyoshindikana",
  "Users involved": "Watumiaji waliohusika",
  "Loading audit history...": "Inapakia historia ya ukaguzi...",
  "No matching audit events.": "Hakuna matukio ya ukaguzi yanayolingana.",
  "Deleted user": "Mtumiaji aliyefutwa",
  "General action": "Kitendo cha jumla",
  "Inspect": "Chunguza",
  "Audit event": "Tukio la ukaguzi",
  "Performed by": "Imefanywa na",
  "Timestamp": "Muda wa tukio",
  "Request": "Ombi",
  "Outcome": "Matokeo",
  "Session": "Kikao",
  "IP address": "Anwani ya IP",
  "User agent": "Kifaa cha mtumiaji",
  "Sanitized change details": "Maelezo salama ya mabadiliko",
  "Unavailable": "Haipatikani",
  "Done": "Imekamilika",
  "Unable to load audit logs.": "Imeshindikana kupakia kumbukumbu za ukaguzi.",
  "HTTP": "HTTP",
  "Share-out": "Mgawanyo",
  "Loan disbursement": "Utoaji wa mkopo",
  "Social-fund payment": "Malipo ya mfuko wa jamii",
  "Social-fund support": "Msaada wa mfuko wa jamii",
  "Social-fund contribution": "Mchango wa mfuko wa jamii",
  "Other income": "Mapato mengine",
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
  Admin:"Msimamizi", Chairperson:"Mwenyekiti", Treasurer:"Mweka hazina", Secretary:"Katibu",
  Loading:"Inapakia", Unable:"Imeshindikana", Error:"Hitilafu", Success:"Imefanikiwa", Successful:"Imefanikiwa", Failed:"Imeshindikana", Required:"Inahitajika", Optional:"Si lazima",
  Yes:"Ndiyo", No:"Hapana", It:"Hilo", Them:"Hayo", Notes:"Maelezo", Note:"Dokezo", Price:"Bei", Value:"Thamani", Number:"Idadi",
  History:"Historia", Summary:"Muhtasari", Statement:"Taarifa", Outstanding:"Haijalipwa", Movement:"Muamala", Account:"Akaunti",
  Recorded:"Imerekodiwa", Requested:"Imeombwa", Created:"Imeundwa", Edited:"Imehaririwa", Updated:"Imesasishwa", Deleted:"Imefutwa", Reversed:"Imebatilishwa",
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
