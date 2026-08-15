<script setup>
import { computed, onMounted, ref } from "vue";
import DashboardLayout from "../../layouts/DashboardLayout.vue";
import { getMembers } from "../../services/member.service.js";
import { getReports } from "../../services/report.service.js";
import { language } from "../../i18n/index.js";

const tabs = [
  ["memberStatement", "Member statement"], ["savings", "Savings"],
  ["outstandingLoans", "Outstanding loans"], ["repayments", "Repayments"],
  ["incomeExpense", "Income / expense"], ["socialFund", "Social fund"],
  ["cashPosition", "Cash position"], ["endOfCycle", "End of cycle"],
];
const activeTab = ref("memberStatement");
const loading = ref(false);
const errorMessage = ref("");
const members = ref([]);
const filters = ref({ member_id: "", from: "", to: "" });
const report = ref({ memberStatement: [], savings: [], outstandingLoans: [], repayments: [], incomeExpense: [], socialFund: [], cashPosition: {}, endOfCycle: {} });
const currency = (value) => new Intl.NumberFormat("en-TZ", { style: "currency", currency: "TZS", maximumFractionDigits: 0 }).format(value || 0);
const date = (value) => value
  ? new Date(value).toLocaleDateString(language.value === "sw" ? "sw-TZ" : "en-TZ")
  : "—";
const movementName = (value) => ({ saving: "Saving", loan_disbursement: "Loan disbursement", repayment: "Repayment", withdrawal: "Withdrawal", fine: "Fine", social_fund: "Social fund", expense: "Expense" }[value] || value);
const activeRows = computed(() => Array.isArray(report.value[activeTab.value]) ? report.value[activeTab.value] : []);

const load = async () => {
  loading.value = true; errorMessage.value = "";
  try {
    const params = Object.fromEntries(Object.entries(filters.value).filter(([, value]) => value));
    const [reportResponse, memberResponse] = await Promise.all([getReports(params), getMembers()]);
    report.value = reportResponse.data?.data || report.value;
    members.value = memberResponse.data?.data || [];
  } catch (error) { errorMessage.value = error.response?.data?.message || "Unable to generate reports."; }
  finally { loading.value = false; }
};
const clearFilters = () => { filters.value = { member_id: "", from: "", to: "" }; load(); };
const exportCsv = () => {
  const rows = activeRows.value;
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [keys, ...rows.map((row) => keys.map((key) => row[key] ?? ""))].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); link.download = `${activeTab.value}-report.csv`; link.click(); URL.revokeObjectURL(link.href);
};
onMounted(load);
</script>

<template>
  <DashboardLayout page-title="Reports" page-subtitle="Financial reporting">
    <section class="page-header no-print"><div class="page-header-copy"><p class="page-header-label">Reporting centre</p><h2>Reports</h2><p class="page-header-text mb-0">Generate consistent financial and member reports from live records.</p></div><div class="header-actions"><button class="btn btn-outline-secondary" @click="window.print()"><i class="bi bi-printer me-2"></i>Print</button><button class="btn btn-primary" :disabled="!activeRows.length" @click="exportCsv"><i class="bi bi-download me-2"></i>Export CSV</button></div></section>
    <section class="card panel-card filter-panel no-print"><div class="card-body"><form class="report-filters" @submit.prevent="load"><div><label>Member</label><select v-model="filters.member_id" class="form-select"><option value="">All members</option><option v-for="member in members" :key="member.id" :value="member.id">{{ member.first_name }} {{ member.last_name }}</option></select></div><div><label>From</label><input v-model="filters.from" class="form-control" type="date" /></div><div><label>To</label><input v-model="filters.to" class="form-control" type="date" /></div><button type="button" class="btn btn-outline-secondary" @click="clearFilters">Clear</button><button class="btn btn-primary">Generate</button></form></div></section>
    <nav class="report-tabs no-print" aria-label="Report types"><button v-for="tab in tabs" :key="tab[0]" :class="{ active: activeTab === tab[0] }" @click="activeTab=tab[0]">{{ tab[1] }}</button></nav>
    <div v-if="errorMessage" class="alert alert-warning">{{ errorMessage }}</div>
    <section class="card panel-card report-sheet"><div class="card-body"><div class="report-title"><div><span>Vikoba financial report</span><h3>{{ tabs.find((tab) => tab[0] === activeTab)?.[1] }}</h3></div><small>{{ filters.from || 'Beginning' }} â€” {{ filters.to || 'Today' }}</small></div><div v-if="loading" class="report-empty">Generating report...</div>
      <template v-else-if="activeTab === 'cashPosition'"><div class="summary-grid"><article><span>Total inflows</span><strong class="positive">{{ currency(report.cashPosition.inflow) }}</strong></article><article><span>Total outflows</span><strong class="negative">{{ currency(report.cashPosition.outflow) }}</strong></article><article><span>Current cash position</span><strong>{{ currency(report.cashPosition.balance) }}</strong></article></div></template>
      <template v-else-if="activeTab === 'endOfCycle'"><div class="summary-grid cycle-grid"><article><span>Total savings</span><strong>{{ currency(report.endOfCycle.totalSavings) }}</strong></article><article><span>Loan repayments</span><strong>{{ currency(report.endOfCycle.totalRepayments) }}</strong></article><article><span>Loan disbursements</span><strong>{{ currency(report.endOfCycle.totalLoanDisbursements) }}</strong></article><article><span>Fines collected</span><strong>{{ currency(report.endOfCycle.totalFines) }}</strong></article><article><span>Social fund</span><strong>{{ currency(report.endOfCycle.totalSocialFund) }}</strong></article><article><span>Expenses</span><strong>{{ currency(report.endOfCycle.totalExpenses) }}</strong></article><article><span>Outstanding loans</span><strong>{{ currency(report.endOfCycle.outstandingLoanBalance) }}</strong></article><article class="highlight"><span>Closing cash</span><strong>{{ currency(report.endOfCycle.closingCash) }}</strong></article></div></template>
      <div v-else-if="activeTab === 'memberStatement'" class="table-responsive"><table class="table report-table"><thead><tr><th>Date</th><th>Member</th><th>Movement</th><th>Description</th><th>Reference</th><th class="text-end">Amount</th></tr></thead><tbody><tr v-for="row in report.memberStatement" :key="row.id"><td>{{ date(row.created_at) }}</td><td>{{ row.first_name ? `${row.first_name} ${row.last_name}` : 'Group account' }}</td><td>{{ movementName(row.type) }}</td><td>{{ row.description }}</td><td>{{ row.reference || 'â€”' }}</td><td class="text-end"><strong :class="row.direction === 'inflow' ? 'positive' : 'negative'">{{ row.direction === 'inflow' ? '+' : 'âˆ’' }} {{ currency(row.amount) }}</strong></td></tr></tbody></table><div v-if="!report.memberStatement.length" class="report-empty">No statement entries found.</div></div>
      <div v-else-if="activeTab === 'savings'" class="table-responsive"><table class="table report-table"><thead><tr><th>Member</th><th>Contributions</th><th>Last contribution</th><th class="text-end">Total savings</th></tr></thead><tbody><tr v-for="row in report.savings" :key="row.member_id"><td><strong>{{ row.first_name }} {{ row.last_name }}</strong></td><td>{{ row.contribution_count }}</td><td>{{ date(row.last_contribution_at) }}</td><td class="text-end"><strong>{{ currency(row.total_savings) }}</strong></td></tr></tbody></table></div>
      <div v-else-if="activeTab === 'outstandingLoans'" class="table-responsive"><table class="table report-table"><thead><tr><th>Member</th><th>Loan amount</th><th>Total payable</th><th>Status</th><th class="text-end">Outstanding</th></tr></thead><tbody><tr v-for="row in report.outstandingLoans" :key="row.id"><td>{{ row.first_name }} {{ row.last_name }}</td><td>{{ currency(row.amount) }}</td><td>{{ currency(row.total_payable) }}</td><td>{{ row.status }}</td><td class="text-end"><strong class="negative">{{ currency(row.remaining_balance) }}</strong></td></tr></tbody></table><div v-if="!report.outstandingLoans.length" class="report-empty">No outstanding loans.</div></div>
      <div v-else-if="activeTab === 'repayments'" class="table-responsive"><table class="table report-table"><thead><tr><th>Date</th><th>Member</th><th>Loan</th><th>Late</th><th>Remaining</th><th class="text-end">Paid</th></tr></thead><tbody><tr v-for="row in report.repayments" :key="row.id"><td>{{ date(row.paid_at) }}</td><td>{{ row.first_name }} {{ row.last_name }}</td><td>#{{ row.loan_id }}</td><td>{{ row.is_late ? 'Yes' : 'No' }}</td><td>{{ currency(row.balance_after) }}</td><td class="text-end"><strong class="positive">{{ currency(row.amount) }}</strong></td></tr></tbody></table><div v-if="!report.repayments.length" class="report-empty">No repayments found.</div></div>
      <div v-else-if="activeTab === 'incomeExpense'" class="table-responsive"><table class="table report-table"><thead><tr><th>Category</th><th>Direction</th><th>Entries</th><th class="text-end">Total</th></tr></thead><tbody><tr v-for="row in report.incomeExpense" :key="`${row.type}-${row.direction}`"><td>{{ movementName(row.type) }}</td><td>{{ row.direction === 'inflow' ? 'Income' : 'Expense' }}</td><td>{{ row.entry_count }}</td><td class="text-end"><strong :class="row.direction === 'inflow' ? 'positive' : 'negative'">{{ currency(row.total) }}</strong></td></tr></tbody></table></div>
      <div v-else-if="activeTab === 'socialFund'" class="table-responsive"><table class="table report-table"><thead><tr><th>Date</th><th>Member</th><th>Description</th><th>Reference</th><th class="text-end">Amount</th></tr></thead><tbody><tr v-for="row in report.socialFund" :key="row.id"><td>{{ date(row.created_at) }}</td><td>{{ row.first_name }} {{ row.last_name }}</td><td>{{ row.description }}</td><td>{{ row.reference || 'â€”' }}</td><td class="text-end"><strong>{{ currency(row.amount) }}</strong></td></tr></tbody></table><div v-if="!report.socialFund.length" class="report-empty">No social-fund payments found.</div></div>
    </div></section>
  </DashboardLayout>
</template>

<style scoped>
.header-actions{display:flex;gap:.5rem}.filter-panel{margin-bottom:1rem}.report-filters{display:grid;gap:.65rem}.report-filters>div label{display:block;margin-bottom:.3rem;color:#73727b;font-size:.68rem;font-weight:600}.report-filters .btn{align-self:end}.report-tabs{display:flex;gap:.35rem;margin-bottom:1rem;padding:.35rem;overflow-x:auto;border:1px solid #ececf1;border-radius:11px;background:#fff}.report-tabs button{flex:0 0 auto;padding:.55rem .75rem;border:0;border-radius:7px;background:transparent;color:#74737c;font-size:.7rem}.report-tabs button.active{background:#7659e8;color:#fff}.report-sheet{min-height:340px}.report-title{display:flex;justify-content:space-between;align-items:flex-end;gap:1rem;padding-bottom:1rem;border-bottom:1px solid #ececf1}.report-title span,.report-title small{color:#8e8d96;font-size:.68rem}.report-title h3{margin:.15rem 0 0;font-size:1.05rem}.report-table{min-width:680px;font-size:.73rem}.summary-grid{display:grid;gap:.75rem;margin-top:1rem}.summary-grid article{padding:1rem;border:1px solid #ececf1;border-radius:10px}.summary-grid span,.summary-grid strong{display:block}.summary-grid span{color:#85848d;font-size:.7rem}.summary-grid strong{margin-top:.5rem;font-size:1.2rem}.summary-grid .highlight{border-color:#dcd4ff;background:#f7f5ff}.positive{color:#168657!important}.negative{color:#cf4b58!important}.report-empty{padding:3rem;text-align:center;color:#8d8c95;font-size:.78rem}@media(min-width:768px){.report-filters{grid-template-columns:minmax(190px,1.3fr) repeat(2,minmax(140px,.8fr)) auto auto}.summary-grid{grid-template-columns:repeat(3,1fr)}.cycle-grid{grid-template-columns:repeat(4,1fr)}}@media print{.no-print{display:none!important}.report-sheet{border:0!important;box-shadow:none!important}.report-title{margin-bottom:1rem}}
</style>

