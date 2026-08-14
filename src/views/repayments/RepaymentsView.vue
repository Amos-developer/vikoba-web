<script setup>
import { computed, onMounted, ref } from "vue";
import DashboardLayout from "../../layouts/DashboardLayout.vue";
import { getLoans } from "../../services/loan.service.js";
import { createRepayment, getRepayments } from "../../services/repayment.service.js";

const repayments = ref([]);
const loans = ref([]);
const loading = ref(false);
const saving = ref(false);
const errorMessage = ref("");
const search = ref("");
const showForm = ref(false);
const form = ref({ loan_id: "", amount: "", due_date: "", paid_at: new Date().toISOString().slice(0, 10), reference: "" });

const currency = (value) => new Intl.NumberFormat("en-TZ", { style: "currency", currency: "TZS", maximumFractionDigits: 0 }).format(value || 0);
const date = (value) => value ? new Date(value).toLocaleDateString() : "â€”";
const eligibleLoans = computed(() => loans.value.filter((loan) => loan.status === "approved" && Number(loan.remaining_balance) > 0));
const selectedLoan = computed(() => eligibleLoans.value.find((loan) => String(loan.id) === String(form.value.loan_id)));
const totalPaid = computed(() => repayments.value.reduce((sum, item) => sum + Number(item.amount), 0));
const lateCount = computed(() => repayments.value.filter((item) => item.is_late).length);
const completedLoans = computed(() => new Set(repayments.value.filter((item) => Number(item.balance_after) === 0).map((item) => item.loan_id)).size);
const filtered = computed(() => {
  const query = search.value.trim().toLowerCase();
  if (!query) return repayments.value;
  return repayments.value.filter((item) => `${item.first_name} ${item.last_name} ${item.reference || ""} ${item.loan_id}`.toLowerCase().includes(query));
});

const load = async () => {
  loading.value = true; errorMessage.value = "";
  try {
    const [repaymentResponse, loanResponse] = await Promise.all([getRepayments(), getLoans()]);
    repayments.value = repaymentResponse.data?.data || [];
    loans.value = loanResponse.data?.data || [];
  } catch (error) { errorMessage.value = error.response?.data?.message || "Unable to load loan repayments."; }
  finally { loading.value = false; }
};
const closeForm = () => { showForm.value = false; errorMessage.value = ""; form.value = { loan_id: "", amount: "", due_date: "", paid_at: new Date().toISOString().slice(0, 10), reference: "" }; };
const submit = async () => {
  saving.value = true; errorMessage.value = "";
  try {
    await createRepayment({ ...form.value, loan_id: Number(form.value.loan_id), amount: Number(form.value.amount), due_date: form.value.due_date || null, paid_at: form.value.paid_at || null, reference: form.value.reference || null });
    closeForm(); await load();
  } catch (error) { errorMessage.value = error.response?.data?.message || "Unable to record repayment."; }
  finally { saving.value = false; }
};
onMounted(load);
</script>

<template>
  <DashboardLayout page-title="Loan Repayments" page-subtitle="Installment tracking">
    <section class="page-header"><div class="page-header-copy"><p class="page-header-label">Repayment management</p><h2>Loan repayments</h2><p class="page-header-text mb-0">Track every installment, outstanding balance, late payment, and completed loan.</p></div><button class="btn btn-primary" @click="showForm=true"><i class="bi bi-plus-lg me-2"></i>Record repayment</button></section>
    <section class="row g-3 mb-4"><div class="col-12 col-sm-4"><article class="info-card"><small class="info-card-label">Total collected</small><h3 class="info-card-value">{{ currency(totalPaid) }}</h3><p class="text-muted mb-0">Across {{ repayments.length }} installments</p></article></div><div class="col-12 col-sm-4"><article class="info-card"><small class="info-card-label">Late payments</small><h3 class="info-card-value late-text">{{ lateCount }}</h3><p class="text-muted mb-0">Installments paid after due date</p></article></div><div class="col-12 col-sm-4"><article class="info-card"><small class="info-card-label">Loans completed</small><h3 class="info-card-value complete-text">{{ completedLoans }}</h3><p class="text-muted mb-0">Balances fully settled</p></article></div></section>
    <section class="card panel-card"><div class="card-body"><div class="records-head"><div><h5 class="mb-1">Installment history</h5><p class="text-muted mb-0">Permanent repayment records from the database.</p></div><label class="repayment-search"><i class="bi bi-search"></i><input v-model="search" placeholder="Member, loan or reference" /></label></div><div v-if="errorMessage && !showForm" class="alert alert-warning">{{ errorMessage }}</div><div class="table-responsive"><table class="table align-middle mb-0 repayment-table"><thead><tr><th>Payment date</th><th>Member</th><th>Loan</th><th>Installment</th><th>Previous balance</th><th>Remaining</th><th>Status</th><th>Reference</th></tr></thead><tbody><tr v-if="loading"><td colspan="8" class="text-center py-5">Loading repayments...</td></tr><tr v-else-if="!filtered.length"><td colspan="8" class="text-center py-5">No repayments found.</td></tr><tr v-for="item in filtered" v-else :key="item.id"><td>{{ date(item.paid_at) }}</td><td><strong>{{ item.first_name }} {{ item.last_name }}</strong><small class="d-block text-muted">Member #{{ item.member_id }}</small></td><td>#{{ item.loan_id }}</td><td><strong>{{ currency(item.amount) }}</strong></td><td>{{ currency(item.balance_before) }}</td><td><strong :class="Number(item.balance_after) === 0 ? 'complete-text' : ''">{{ currency(item.balance_after) }}</strong></td><td><span v-if="Number(item.balance_after) === 0" class="repayment-status completed">Completed</span><span v-else-if="item.is_late" class="repayment-status late">Late</span><span v-else class="repayment-status paid">On time</span></td><td><code>{{ item.reference || `REPAY-${item.id}` }}</code></td></tr></tbody></table></div></div></section>
    <div v-if="showForm" class="modal-backdrop"><div class="modal-panel"><div class="modal-panel-header"><div><p class="page-header-label mb-2">New installment</p><h5 class="mb-0">Record loan repayment</h5></div><button class="btn btn-close" @click="closeForm"></button></div><form class="mt-3" @submit.prevent="submit"><div class="row g-3"><div class="col-12"><label class="form-label">Loan account</label><select v-model="form.loan_id" class="form-select" required><option value="" disabled>Select an active loan</option><option v-for="loan in eligibleLoans" :key="loan.id" :value="loan.id">Loan #{{ loan.id }} â€” {{ loan.first_name }} {{ loan.last_name }} â€” {{ currency(loan.remaining_balance) }} remaining</option></select><small v-if="!eligibleLoans.length" class="text-muted">No approved loans have an outstanding balance.</small></div><div class="col-12 col-md-6"><label class="form-label">Amount paid (TZS)</label><input v-model="form.amount" class="form-control" type="number" min="1" :max="selectedLoan?.remaining_balance" required /></div><div class="col-12 col-md-6"><label class="form-label">Payment date</label><input v-model="form.paid_at" class="form-control" type="date" required /></div><div class="col-12 col-md-6"><label class="form-label">Installment due date</label><input v-model="form.due_date" class="form-control" type="date" /></div><div class="col-12 col-md-6"><label class="form-label">Reference</label><input v-model="form.reference" class="form-control" placeholder="Receipt or payment reference" /></div></div><div v-if="selectedLoan" class="balance-preview"><span>Current outstanding balance</span><strong>{{ currency(selectedLoan.remaining_balance) }}</strong></div><p v-if="errorMessage" class="text-danger small mt-3">{{ errorMessage }}</p><div class="modal-actions"><button type="button" class="btn btn-outline-secondary" @click="closeForm">Cancel</button><button class="btn btn-primary" :disabled="saving || !eligibleLoans.length">{{ saving ? 'Recording...' : 'Record repayment' }}</button></div></form></div></div>
  </DashboardLayout>
</template>

<style scoped>
.records-head{display:flex;flex-direction:column;gap:.8rem;margin-bottom:1rem}.repayment-search{display:flex;align-items:center;gap:.5rem;padding:.55rem .7rem;border:1px solid #e5e4ea;border-radius:8px;color:#92919a}.repayment-search input{width:100%;border:0;outline:0;font-size:.72rem}.repayment-table{min-width:900px}.repayment-status{display:inline-flex;padding:.28rem .55rem;border-radius:999px;font-size:.65rem}.repayment-status.paid,.repayment-status.completed{background:#eaf9f1;color:#168657}.repayment-status.late{background:#fff0f1;color:#cf4b58}.late-text{color:#cf4b58!important}.complete-text{color:#168657!important}.repayment-table code{color:#7056dc;font-size:.67rem}.balance-preview{display:flex;align-items:center;justify-content:space-between;margin-top:1rem;padding:.75rem;border-radius:8px;background:#f7f5ff;color:#6f56db;font-size:.72rem}@media(min-width:768px){.records-head{flex-direction:row;align-items:center;justify-content:space-between}.repayment-search{width:min(100%,290px)}}
</style>


