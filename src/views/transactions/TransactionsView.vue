<script setup>
import { computed, onMounted, ref } from "vue";
import DashboardLayout from "../../layouts/DashboardLayout.vue";
import { getMembers } from "../../services/member.service.js";
import { createTransaction, getTransactions } from "../../services/transaction.service.js";

const types = [
  ["saving", "Saving"], ["loan_disbursement", "Loan disbursement"],
  ["repayment", "Repayment"], ["withdrawal", "Withdrawal"],
  ["fine", "Fine"], ["social_fund", "Social-fund payment"], ["expense", "Expense"],
];
const transactions = ref([]);
const members = ref([]);
const loading = ref(false);
const saving = ref(false);
const errorMessage = ref("");
const showForm = ref(false);
const filters = ref({ search: "", type: "", direction: "", from: "", to: "" });
const form = ref({ member_id: "", amount: "", type: "saving", description: "", reference: "" });

const currency = (value) => new Intl.NumberFormat("en-TZ", { style: "currency", currency: "TZS", maximumFractionDigits: 0 }).format(value || 0);
const typeLabel = (value) => types.find(([key]) => key === value)?.[1] || value;
const inflow = computed(() => transactions.value.filter((item) => item.direction === "inflow").reduce((sum, item) => sum + Number(item.amount), 0));
const outflow = computed(() => transactions.value.filter((item) => item.direction === "outflow").reduce((sum, item) => sum + Number(item.amount), 0));
const requiresMember = computed(() => form.value.type !== "expense");

const load = async () => {
  loading.value = true;
  errorMessage.value = "";
  try {
    const params = Object.fromEntries(Object.entries(filters.value).filter(([, value]) => value));
    const [ledgerResponse, membersResponse] = await Promise.all([getTransactions(params), getMembers()]);
    transactions.value = ledgerResponse.data?.data || [];
    members.value = membersResponse.data?.data || [];
  } catch (error) { errorMessage.value = error.response?.data?.message || "Unable to load the ledger."; }
  finally { loading.value = false; }
};
const resetForm = () => { form.value = { member_id: "", amount: "", type: "saving", description: "", reference: "" }; errorMessage.value = ""; };
const closeForm = () => { showForm.value = false; resetForm(); };
const submit = async () => {
  if (requiresMember.value && !form.value.member_id) { errorMessage.value = "Select a member for this movement."; return; }
  saving.value = true;
  try {
    await createTransaction({ ...form.value, member_id: form.value.member_id || null, amount: Number(form.value.amount), reference: form.value.reference || null });
    closeForm(); await load();
  } catch (error) { errorMessage.value = error.response?.data?.message || "Unable to record this movement."; }
  finally { saving.value = false; }
};
const exportCsv = () => {
  const headings = ["Date", "Reference", "Member", "Type", "Direction", "Description", "Amount", "Recorded by"];
  const rows = transactions.value.map((item) => [item.created_at, item.reference || "", `${item.first_name || ""} ${item.last_name || ""}`.trim(), typeLabel(item.type), item.direction, item.description, item.amount, item.recorded_by_name || ""]);
  const csv = [headings, ...rows].map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  link.download = `vikoba-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click(); URL.revokeObjectURL(link.href);
};
onMounted(load);
</script>

<template>
  <DashboardLayout page-title="Transactions" page-subtitle="Financial audit trail">
    <section class="page-header"><div class="page-header-copy"><p class="page-header-label">Financial ledger</p><h2>Transactions</h2><p class="page-header-text mb-0">A permanent record of every financial movement in the group.</p></div><div class="header-actions"><button class="btn btn-outline-secondary" @click="exportCsv"><i class="bi bi-download me-2"></i>Export CSV</button><button class="btn btn-primary" @click="showForm=true"><i class="bi bi-plus-lg me-2"></i>Record movement</button></div></section>
    <section class="row g-3 mb-4"><div class="col-12 col-sm-4"><article class="info-card"><small class="info-card-label">Ledger entries</small><h3 class="info-card-value">{{ transactions.length }}</h3><p class="text-muted mb-0">Matching current filters</p></article></div><div class="col-12 col-sm-4"><article class="info-card"><small class="info-card-label">Money in</small><h3 class="info-card-value inflow-text">{{ currency(inflow) }}</h3><p class="text-muted mb-0">Savings, repayments, fines and social fund</p></article></div><div class="col-12 col-sm-4"><article class="info-card"><small class="info-card-label">Money out</small><h3 class="info-card-value outflow-text">{{ currency(outflow) }}</h3><p class="text-muted mb-0">Loans, withdrawals and expenses</p></article></div></section>
    <section class="card panel-card"><div class="card-body"><div class="ledger-head"><div><h5 class="mb-1">Audit trail</h5><p class="text-muted mb-0">Ledger entries cannot be edited or deleted.</p></div><span class="immutable"><i class="bi bi-lock"></i>Append only</span></div>
      <form class="filter-grid" @submit.prevent="load"><label class="search-field"><i class="bi bi-search"></i><input v-model="filters.search" placeholder="Member, reference or description" /></label><select v-model="filters.type"><option value="">All movement types</option><option v-for="type in types" :key="type[0]" :value="type[0]">{{ type[1] }}</option></select><select v-model="filters.direction"><option value="">Money in and out</option><option value="inflow">Money in</option><option value="outflow">Money out</option></select><input v-model="filters.from" type="date" aria-label="From date" /><input v-model="filters.to" type="date" aria-label="To date" /><button class="btn btn-primary">Apply</button></form>
      <div v-if="errorMessage && !showForm" class="alert alert-warning">{{ errorMessage }}</div>
      <div class="table-responsive"><table class="table align-middle mb-0 ledger-table"><thead><tr><th>Date</th><th>Reference</th><th>Member / Payee</th><th>Movement</th><th>Description</th><th>Recorded by</th><th class="text-end">Amount</th></tr></thead><tbody><tr v-if="loading"><td colspan="7" class="text-center py-5">Loading ledger...</td></tr><tr v-else-if="!transactions.length"><td colspan="7" class="text-center py-5">No ledger entries found.</td></tr><tr v-for="item in transactions" v-else :key="item.id"><td class="date-cell">{{ new Date(item.created_at).toLocaleString() }}</td><td><code>{{ item.reference || `TXN-${item.id}` }}</code></td><td><strong>{{ item.first_name ? `${item.first_name} ${item.last_name}` : 'Group account' }}</strong></td><td><span class="movement-icon" :class="item.direction"><i class="bi" :class="item.direction === 'inflow' ? 'bi-arrow-down-left' : 'bi-arrow-up-right'"></i></span>{{ typeLabel(item.type) }}</td><td>{{ item.description }}</td><td>{{ item.recorded_by_name || 'System' }}</td><td class="text-end"><strong :class="item.direction === 'inflow' ? 'inflow-text' : 'outflow-text'">{{ item.direction === 'inflow' ? '+' : 'âˆ’' }} {{ currency(item.amount) }}</strong></td></tr></tbody></table></div>
    </div></section>
    <div v-if="showForm" class="modal-backdrop"><div class="modal-panel"><div class="modal-panel-header"><div><p class="page-header-label mb-2">New ledger entry</p><h5 class="mb-0">Record financial movement</h5></div><button class="btn btn-close" @click="closeForm"></button></div><form class="mt-3" @submit.prevent="submit"><div class="row g-3"><div class="col-12 col-md-6"><label class="form-label">Movement type</label><select v-model="form.type" class="form-select"><option v-for="type in types" :key="type[0]" :value="type[0]">{{ type[1] }}</option></select></div><div class="col-12 col-md-6"><label class="form-label">Amount (TZS)</label><input v-model="form.amount" class="form-control" type="number" min="1" required /></div><div v-if="requiresMember" class="col-12"><label class="form-label">Member</label><select v-model="form.member_id" class="form-select" required><option value="" disabled>Select a member</option><option v-for="member in members" :key="member.id" :value="member.id">{{ member.first_name }} {{ member.last_name }} â€” {{ member.phone }}</option></select></div><div class="col-12"><label class="form-label">Description</label><textarea v-model="form.description" class="form-control" rows="3" maxlength="255" required></textarea></div><div class="col-12"><label class="form-label">Reference <span class="text-muted">(optional)</span></label><input v-model="form.reference" class="form-control" placeholder="Receipt, voucher or external reference" /></div></div><p class="audit-note"><i class="bi bi-lock"></i>This entry becomes permanent after saving.</p><p v-if="errorMessage" class="text-danger small">{{ errorMessage }}</p><div class="modal-actions"><button type="button" class="btn btn-outline-secondary" @click="closeForm">Cancel</button><button class="btn btn-primary" :disabled="saving">{{ saving ? 'Recording...' : 'Record movement' }}</button></div></form></div></div>
  </DashboardLayout>
</template>

<style scoped>
.header-actions{display:flex;flex-wrap:wrap;gap:.5rem}.ledger-head{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding-bottom:1rem}.immutable{display:inline-flex;align-items:center;gap:.35rem;padding:.35rem .6rem;border-radius:999px;background:#f0edff;color:#6f56db;font-size:.66rem}.filter-grid{display:grid;gap:.5rem;margin:0 -1rem 1rem;padding:.75rem 1rem;border-block:1px solid #f0f0f3;background:#fafafa}.filter-grid input,.filter-grid select,.search-field{min-height:38px;border:1px solid #e5e4ea;border-radius:8px;background:#fff;font-size:.72rem}.filter-grid>input,.filter-grid select{padding:0 .65rem}.search-field{display:flex;align-items:center;gap:.5rem;padding:0 .65rem}.search-field input{width:100%;min-height:auto;border:0;outline:0}.ledger-table{min-width:940px}.date-cell{white-space:nowrap;color:#777680}.ledger-table code{color:#7056dc;font-size:.68rem}.movement-icon{width:1.65rem;height:1.65rem;display:inline-grid;place-items:center;margin-right:.45rem;border-radius:7px}.movement-icon.inflow{background:#eaf9f1;color:#168657}.movement-icon.outflow{background:#fff0f1;color:#cf4b58}.inflow-text{color:#168657!important}.outflow-text{color:#cf4b58!important}.audit-note{display:flex;align-items:center;gap:.4rem;margin:1rem 0 0;padding:.65rem;border-radius:8px;background:#f7f5ff;color:#6f56db;font-size:.68rem}@media(min-width:768px){.filter-grid{grid-template-columns:minmax(210px,1.4fr) repeat(2,minmax(130px,.8fr)) repeat(2,minmax(120px,.65fr)) auto}}
</style>


