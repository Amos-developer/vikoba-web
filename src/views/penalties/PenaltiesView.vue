<script setup>
import { computed, onMounted, ref } from "vue";
import DashboardLayout from "../../layouts/DashboardLayout.vue";
import { createPenalty, deletePenalty, getPenalties, updatePenalty } from "../../services/penalty.service.js";
import { getMembers } from "../../services/member.service.js";

const penalties = ref([]);
const members = ref([]);
const loading = ref(false);
const saving = ref(false);
const errorMessage = ref("");
const search = ref("");
const statusFilter = ref("all");
const showForm = ref(false);
const showDelete = ref(false);
const selected = ref(null);
const form = ref({ member_id: "", amount: "", reason: "", status: "unpaid", due_date: "" });

const currency = (value) => new Intl.NumberFormat("en-TZ", { style: "currency", currency: "TZS", maximumFractionDigits: 0 }).format(value || 0);
const date = (value) => value ? new Date(value).toLocaleDateString() : "â€”";
const total = computed(() => penalties.value.reduce((sum, item) => sum + Number(item.amount || 0), 0));
const unpaid = computed(() => penalties.value.filter((item) => item.status === "unpaid"));
const unpaidTotal = computed(() => unpaid.value.reduce((sum, item) => sum + Number(item.amount || 0), 0));
const filtered = computed(() => {
  const query = search.value.trim().toLowerCase();
  return penalties.value.filter((item) => {
    const matchesStatus = statusFilter.value === "all" || item.status === statusFilter.value;
    const matchesQuery = !query || `${item.first_name} ${item.last_name} ${item.reason}`.toLowerCase().includes(query);
    return matchesStatus && matchesQuery;
  });
});

const reset = () => {
  selected.value = null;
  form.value = { member_id: "", amount: "", reason: "", status: "unpaid", due_date: "" };
  errorMessage.value = "";
};
const openCreate = () => { reset(); showForm.value = true; };
const openEdit = (item) => {
  selected.value = item;
  form.value = { member_id: item.member_id, amount: item.amount, reason: item.reason, status: item.status, due_date: item.due_date?.slice(0, 10) || "" };
  showForm.value = true;
};
const closeForm = () => { showForm.value = false; reset(); };
const load = async () => {
  loading.value = true;
  try {
    const [penaltiesResponse, membersResponse] = await Promise.all([
      getPenalties(),
      getMembers(),
    ]);
    penalties.value = penaltiesResponse.data?.data || [];
    members.value = membersResponse.data?.data || [];
  }
  catch (error) { errorMessage.value = error.response?.data?.message || "Unable to load penalties."; }
  finally { loading.value = false; }
};
const submit = async () => {
  if (!form.value.member_id || Number(form.value.amount) <= 0 || !form.value.reason.trim()) {
    errorMessage.value = "Member, positive amount, and reason are required.";
    return;
  }
  saving.value = true;
  try {
    const payload = { ...form.value, member_id: Number(form.value.member_id), amount: Number(form.value.amount), due_date: form.value.due_date || null };
    selected.value ? await updatePenalty(selected.value.id, payload) : await createPenalty(payload);
    closeForm(); await load();
  } catch (error) { errorMessage.value = error.response?.data?.message || "Unable to save penalty."; }
  finally { saving.value = false; }
};
const markPaid = async (item) => { await updatePenalty(item.id, { status: "paid" }); await load(); };
const remove = async () => {
  if (!selected.value) return;
  saving.value = true;
  try { await deletePenalty(selected.value.id); showDelete.value = false; selected.value = null; await load(); }
  catch (error) { errorMessage.value = error.response?.data?.message || "Unable to delete penalty."; }
  finally { saving.value = false; }
};
onMounted(load);
</script>

<template>
  <DashboardLayout page-title="Penalties" page-subtitle="Member accountability">
    <section class="page-header">
      <div class="page-header-copy"><p class="page-header-label">Penalty management</p><h2>Penalties</h2><p class="page-header-text mb-0">Track member charges, payment status, and due dates.</p></div>
      <button class="btn btn-primary" @click="openCreate"><i class="bi bi-plus-lg me-2"></i>Add penalty</button>
    </section>

    <section class="row g-3 mb-4">
      <div class="col-12 col-sm-4"><article class="info-card"><small class="info-card-label">Total records</small><h3 class="info-card-value">{{ penalties.length }}</h3><p class="text-muted mb-0">All recorded penalties</p></article></div>
      <div class="col-12 col-sm-4"><article class="info-card"><small class="info-card-label">Outstanding</small><h3 class="info-card-value">{{ unpaid.length }}</h3><p class="text-muted mb-0">Awaiting payment</p></article></div>
      <div class="col-12 col-sm-4"><article class="info-card"><small class="info-card-label">Outstanding value</small><h3 class="info-card-value">{{ currency(unpaidTotal) }}</h3><p class="text-muted mb-0">{{ currency(total) }} total issued</p></article></div>
    </section>

    <section class="card panel-card">
      <div class="card-body">
        <div class="penalty-toolbar">
          <div><h5 class="mb-1">Penalty records</h5><p class="text-muted mb-0">Review and manage charges from the database.</p></div>
          <div class="filters"><label><i class="bi bi-search"></i><input v-model="search" placeholder="Search penalties" /></label><select v-model="statusFilter"><option value="all">All statuses</option><option value="unpaid">Unpaid</option><option value="paid">Paid</option><option value="waived">Waived</option></select></div>
        </div>
        <div v-if="errorMessage" class="alert alert-warning">{{ errorMessage }}</div>
        <div class="table-responsive d-none d-md-block">
          <table class="table align-middle mb-0"><thead><tr><th>Member</th><th>Reason</th><th>Amount</th><th>Due date</th><th>Status</th><th class="text-end">Actions</th></tr></thead>
            <tbody><tr v-if="loading"><td colspan="6" class="text-center py-5">Loading penalties...</td></tr><tr v-else-if="!filtered.length"><td colspan="6" class="text-center py-5">No penalties found.</td></tr>
              <tr v-for="item in filtered" v-else :key="item.id"><td><strong>{{ item.first_name }} {{ item.last_name }}</strong><small class="d-block text-muted">Member #{{ item.member_id }}</small></td><td>{{ item.reason }}</td><td><strong>{{ currency(item.amount) }}</strong></td><td>{{ date(item.due_date) }}</td><td><span class="penalty-status" :class="item.status">{{ item.status }}</span></td><td><div class="action-group"><button v-if="item.status === 'unpaid'" class="btn btn-sm btn-outline-success" @click="markPaid(item)">Mark paid</button><button class="btn btn-sm btn-outline-primary" @click="openEdit(item)">Edit</button><button class="btn btn-sm btn-outline-danger" @click="selected=item;showDelete=true">Delete</button></div></td></tr>
            </tbody></table>
        </div>
        <div class="penalty-cards d-md-none"><div v-if="loading" class="empty-state">Loading penalties...</div><div v-else-if="!filtered.length" class="empty-state">No penalties found.</div><article v-for="item in filtered" v-else :key="item.id" class="penalty-card"><div><strong>{{ item.first_name }} {{ item.last_name }}</strong><span class="penalty-status" :class="item.status">{{ item.status }}</span></div><p>{{ item.reason }}</p><dl><div><dt>Amount</dt><dd>{{ currency(item.amount) }}</dd></div><div><dt>Due</dt><dd>{{ date(item.due_date) }}</dd></div></dl><div class="action-group"><button v-if="item.status==='unpaid'" class="btn btn-sm btn-outline-success" @click="markPaid(item)">Mark paid</button><button class="btn btn-sm btn-outline-primary" @click="openEdit(item)">Edit</button><button class="btn btn-sm btn-outline-danger" @click="selected=item;showDelete=true">Delete</button></div></article></div>
      </div>
    </section>

    <div v-if="showForm" class="modal-backdrop">
      <div class="modal-panel penalty-modal" role="dialog" aria-modal="true" aria-labelledby="penalty-title">
        <div class="modal-panel-header">
          <div class="modal-title-group"><span class="modal-icon"><i class="bi bi-exclamation-diamond"></i></span><div><p class="page-header-label">{{ selected ? 'Edit record' : 'New record' }}</p><h5 id="penalty-title" class="mb-0">{{ selected ? 'Update penalty' : 'Add member penalty' }}</h5></div></div>
          <button class="btn-close" type="button" aria-label="Close" @click="closeForm"></button>
        </div>
        <form @submit.prevent="submit">
          <section class="form-section">
            <div class="form-section-copy"><strong>Member and charge</strong><span>Select a member and enter the penalty details.</span></div>
            <div class="form-grid">
              <div class="field field-wide"><label class="form-label" for="penalty-member">Member</label><div class="select-wrap"><i class="bi bi-person"></i><select id="penalty-member" v-model="form.member_id" class="form-select" required><option value="" disabled>Select a member</option><option v-for="member in members" :key="member.id" :value="member.id">{{ member.first_name }} {{ member.last_name }} Â· {{ member.phone }}</option></select></div><small v-if="!members.length">No members available. Add a member first.</small></div>
              <div class="field"><label class="form-label" for="penalty-amount">Amount (TZS)</label><div class="input-wrap"><span>TZS</span><input id="penalty-amount" v-model="form.amount" class="form-control" type="number" min="1" step="1" placeholder="0" required /></div></div>
              <div class="field field-wide"><label class="form-label" for="penalty-reason">Reason</label><textarea id="penalty-reason" v-model="form.reason" class="form-control" rows="3" maxlength="255" placeholder="Briefly explain why this penalty was issued" required></textarea><small>{{ form.reason.length }}/255 characters</small></div>
            </div>
          </section>
          <section class="form-section form-section-muted"><div class="form-section-copy"><strong>Payment details</strong><span>Set the initial status and optional due date.</span></div><div class="form-grid"><div class="field"><label class="form-label" for="penalty-status">Status</label><select id="penalty-status" v-model="form.status" class="form-select"><option value="unpaid">Unpaid</option><option value="paid">Paid</option><option value="waived">Waived</option></select></div><div class="field"><label class="form-label" for="penalty-date">Due date <span>Optional</span></label><input id="penalty-date" v-model="form.due_date" class="form-control" type="date" /></div></div></section>
          <div v-if="errorMessage" class="form-alert"><i class="bi bi-exclamation-circle"></i>{{ errorMessage }}</div>
          <div class="modal-actions"><button type="button" class="btn btn-outline-secondary" @click="closeForm">Cancel</button><button class="btn btn-primary" :disabled="saving || !members.length"><span v-if="saving" class="spinner-border spinner-border-sm"></span>{{ saving ? 'Saving...' : selected ? 'Save changes' : 'Add penalty' }}</button></div>
        </form>
      </div>
    </div>
    <div v-if="showDelete" class="modal-backdrop"><div class="modal-panel confirm-panel"><h5>Delete this penalty?</h5><p class="text-muted">This action permanently removes the record.</p><div class="modal-actions"><button class="btn btn-outline-secondary" @click="showDelete=false">Cancel</button><button class="btn btn-danger" :disabled="saving" @click="remove">{{ saving ? 'Deleting...' : 'Delete penalty' }}</button></div></div></div>
  </DashboardLayout>
</template>

<style scoped>
.penalty-toolbar{display:flex;flex-direction:column;gap:1rem;margin-bottom:1rem}.filters{display:grid;gap:.5rem}.filters label{display:flex;align-items:center;gap:.5rem;padding:.55rem .7rem;border:1px solid #e6e5eb;border-radius:8px;color:#96959d}.filters input,.filters select{min-height:36px;border:1px solid #e6e5eb;border-radius:8px;background:#fff;font-size:.75rem}.filters label input{width:100%;min-height:auto;border:0;outline:0}.filters select{padding:0 .65rem}.penalty-status{display:inline-flex;padding:.28rem .55rem;border-radius:999px;font-size:.65rem;text-transform:capitalize}.penalty-status.unpaid{background:#fff5dd;color:#a66a08}.penalty-status.paid{background:#eaf9f1;color:#168657}.penalty-status.waived{background:#f0edff;color:#6f56db}.penalty-cards{display:grid;gap:.75rem}.penalty-card{padding:1rem;border:1px solid #ececf1;border-radius:11px}.penalty-card>div:first-child{display:flex;justify-content:space-between;gap:.5rem}.penalty-card p{margin:.75rem 0;color:#67666e}.penalty-card dl{display:grid;grid-template-columns:1fr 1fr;gap:.5rem}.penalty-card dl div{padding:.6rem;border-radius:8px;background:#fafafa}.penalty-card dt{color:#8a8993;font-size:.65rem}.penalty-card dd{margin:.15rem 0 0;font-size:.75rem;font-weight:600}@media(min-width:768px){.penalty-toolbar{flex-direction:row;align-items:center;justify-content:space-between}.filters{grid-template-columns:minmax(190px,1fr) auto}.penalty-toolbar .filters{width:min(100%,390px)}}
.penalty-modal{width:min(100%,620px);padding:0!important;overflow:hidden}.modal-title-group{display:flex;align-items:center;gap:.75rem}.modal-icon{width:2.25rem;height:2.25rem;display:grid;place-items:center;border-radius:9px;background:#f0edff;color:#7056dc}.penalty-modal .modal-panel-header{align-items:center;padding:1rem 1.15rem}.penalty-modal form{overflow-y:auto;max-height:calc(100vh - 92px)}.form-section{padding:1rem 1.15rem}.form-section-muted{border-block:1px solid #f0f0f3;background:#fafafa}.form-section-copy{margin-bottom:.85rem}.form-section-copy strong,.form-section-copy span{display:block}.form-section-copy strong{font-size:.8rem}.form-section-copy span{margin-top:.15rem;color:#8b8a93;font-size:.68rem}.form-grid{display:grid;gap:.85rem}.field{min-width:0}.field>small{display:block;margin-top:.3rem;color:#96959d;font-size:.63rem}.field .form-label span{color:#a2a1a9;font-weight:400}.select-wrap,.input-wrap{position:relative;display:flex;align-items:center}.select-wrap i{position:absolute;left:.75rem;z-index:1;color:#8e8d96}.select-wrap select{padding-left:2.2rem}.input-wrap>span{position:absolute;left:.7rem;z-index:1;color:#8e8d96;font-size:.65rem;font-weight:600}.input-wrap input{padding-left:2.8rem}.penalty-modal textarea{resize:vertical;min-height:82px}.form-alert{display:flex;align-items:center;gap:.45rem;margin:.9rem 1.15rem 0;padding:.65rem .75rem;border-radius:8px;background:#fff5dd;color:#956006;font-size:.7rem}.penalty-modal .modal-actions{margin:0;padding:1rem 1.15rem}.penalty-modal .modal-actions .btn-primary{min-width:112px}@media(min-width:600px){.form-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.field-wide{grid-column:1/-1}}
</style>


