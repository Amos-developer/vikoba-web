<script setup>
import { computed, onMounted, ref } from "vue";
import DashboardLayout from "../../layouts/DashboardLayout.vue";
import { useAuthStore } from "../../stores/auth.store.js";
import { createUser, getApprovals, getUsers, reviewApproval, updateUser } from "../../services/admin.service.js";

const roles = ["admin", "chairperson", "treasurer", "secretary", "member"];
const authStore = useAuthStore();
const activeTab = ref("approvals");
const users = ref([]);
const approvals = ref([]);
const loading = ref(false);
const saving = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const approvalFilter = ref("pending");
const showUserForm = ref(false);
const showReview = ref(false);
const selectedApproval = ref(null);
const decision = ref("approved");
const reviewNote = ref("");
const userForm = ref({ name: "", email: "", password: "", role: "member" });

const isAdmin = computed(() => authStore.user?.role === "admin");
const pendingCount = computed(() => approvals.value.filter((item) => item.status === "pending").length);
const ownPendingCount = computed(() => approvals.value.filter(
  (item) => item.status === "pending"
    && Number(item.requested_by) === Number(authStore.user?.userId),
).length);
const roleLabel = (role) => role.charAt(0).toUpperCase() + role.slice(1);
const actionLabel = (action) => ({ loan_disbursement: "Loan disbursement", withdrawal: "Withdrawal", expense: "Expense", penalty_waiver: "Penalty waiver", social_fund_disbursement: "Social-fund support" }[action] || action);
const currency = (value) => new Intl.NumberFormat("en-TZ", { style: "currency", currency: "TZS", maximumFractionDigits: 0 }).format(value || 0);

const load = async () => {
  loading.value = true; errorMessage.value = "";
  try {
    const requests = [getApprovals(approvalFilter.value)];
    if (isAdmin.value) requests.push(getUsers());
    const [approvalResponse, userResponse] = await Promise.all(requests);
    approvals.value = approvalResponse.data?.data || [];
    if (userResponse) users.value = userResponse.data?.data || [];
  } catch (error) { errorMessage.value = error.response?.data?.message || "Unable to load access management."; }
  finally { loading.value = false; }
};
const submitUser = async () => {
  saving.value = true; errorMessage.value = "";
  try { await createUser(userForm.value); showUserForm.value = false; userForm.value = { name: "", email: "", password: "", role: "member" }; successMessage.value = "User account created."; await load(); }
  catch (error) { errorMessage.value = error.response?.data?.message || "Unable to create user."; }
  finally { saving.value = false; }
};
const changeRole = async (user, role) => {
  try { await updateUser(user.id, { role }); user.role = role; successMessage.value = "User role updated."; }
  catch (error) { errorMessage.value = error.response?.data?.message || "Unable to update role."; await load(); }
};
const toggleUser = async (user) => {
  try { const response = await updateUser(user.id, { is_active: !user.is_active }); user.is_active = response.data.data.is_active; }
  catch (error) { errorMessage.value = error.response?.data?.message || "Unable to update user."; }
};
const openReview = (approval, nextDecision) => { selectedApproval.value = approval; decision.value = nextDecision; reviewNote.value = ""; showReview.value = true; };
const submitReview = async () => {
  saving.value = true; errorMessage.value = "";
  try { await reviewApproval(selectedApproval.value.id, { decision: decision.value, note: reviewNote.value }); showReview.value = false; successMessage.value = `Request ${decision.value}.`; await load(); }
  catch (error) { errorMessage.value = error.response?.data?.message || "Unable to review request."; }
  finally { saving.value = false; }
};
onMounted(load);
</script>

<template>
  <DashboardLayout page-title="Users & Approvals" page-subtitle="Access and financial controls">
    <section class="page-header"><div class="page-header-copy"><p class="page-header-label">Administration</p><h2>Users, roles & approvals</h2><p class="page-header-text mb-0">Manage access and enforce two-person review for sensitive financial actions.</p></div><button v-if="isAdmin && activeTab === 'users'" class="btn btn-primary" @click="showUserForm=true"><i class="bi bi-person-plus me-2"></i>Add user</button></section>
    <div class="access-tabs"><button :class="{ active: activeTab === 'approvals' }" @click="activeTab='approvals'"><i class="bi bi-check2-square"></i>Approvals <span>{{ pendingCount }}</span></button><button v-if="isAdmin" :class="{ active: activeTab === 'users' }" @click="activeTab='users'"><i class="bi bi-people"></i>Users & roles</button></div>
    <div v-if="errorMessage" class="alert alert-warning">{{ errorMessage }}</div><div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
    <div v-if="activeTab === 'approvals' && ownPendingCount" class="alert alert-info"><i class="bi bi-shield-lock me-2"></i>{{ ownPendingCount }} pending {{ ownPendingCount === 1 ? 'request was' : 'requests were' }} submitted by you. A different Admin, Chairperson, or Treasurer must review {{ ownPendingCount === 1 ? 'it' : 'them' }}.</div>

    <section v-if="activeTab === 'approvals'" class="card panel-card"><div class="card-body"><div class="panel-heading"><div><h5 class="mb-1">Financial approval queue</h5><p class="text-muted mb-0">Requesters cannot review their own requests.</p></div><select v-model="approvalFilter" class="form-select" @change="load"><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="">All requests</option></select></div><div class="table-responsive"><table class="table align-middle mb-0 approval-table"><thead><tr><th>Requested</th><th>Action</th><th>Details</th><th>Requested by</th><th>Status</th><th class="text-end">Review</th></tr></thead><tbody><tr v-if="loading"><td colspan="6" class="text-center py-5">Loading requests...</td></tr><tr v-else-if="!approvals.length"><td colspan="6" class="text-center py-5">No approval requests found.</td></tr><tr v-for="item in approvals" v-else :key="item.id"><td>{{ new Date(item.created_at).toLocaleString() }}</td><td><strong>{{ actionLabel(item.action_type) }}</strong><small v-if="item.entity_id" class="d-block text-muted">Record #{{ item.entity_id }}</small></td><td><span>{{ item.reason }}</span><small v-if="item.payload?.amount" class="d-block">{{ currency(item.payload.amount) }}</small></td><td>{{ item.requested_by_name }}<small class="d-block text-muted">{{ roleLabel(item.requester_role) }}</small></td><td><span class="approval-status" :class="item.status">{{ item.status }}</span></td><td class="text-end"><div v-if="item.status === 'pending'" class="review-actions"><button class="btn btn-sm btn-outline-danger" :disabled="Number(item.requested_by) === Number(authStore.user?.userId)" @click="openReview(item,'rejected')">Reject</button><button class="btn btn-sm btn-outline-success" :disabled="Number(item.requested_by) === Number(authStore.user?.userId)" @click="openReview(item,'approved')">Approve</button></div><span v-else class="reviewed-by">{{ item.reviewed_by_name || 'â€”' }}</span></td></tr></tbody></table></div></div></section>

    <section v-else class="card panel-card"><div class="card-body"><div class="panel-heading"><div><h5 class="mb-1">Application users</h5><p class="text-muted mb-0">Admins inherit every role permission.</p></div><span class="count-pill">{{ users.length }} users</span></div><div class="table-responsive"><table class="table align-middle mb-0 user-table"><thead><tr><th>User</th><th>Role</th><th>Access</th><th>Created</th></tr></thead><tbody><tr v-if="loading"><td colspan="4" class="text-center py-5">Loading users...</td></tr><tr v-for="user in users" v-else :key="user.id"><td><strong>{{ user.name }}</strong><small class="d-block text-muted">{{ user.email }}</small></td><td><select :value="user.role" class="role-select" :disabled="Number(user.id) === Number(authStore.user?.userId)" @change="changeRole(user,$event.target.value)"><option v-for="role in roles" :key="role" :value="role">{{ roleLabel(role) }}</option></select></td><td><button class="access-toggle" :class="{ active: user.is_active }" :disabled="Number(user.id) === Number(authStore.user?.userId)" @click="toggleUser(user)"><span></span>{{ user.is_active ? 'Active' : 'Inactive' }}</button></td><td>{{ new Date(user.created_at).toLocaleDateString() }}</td></tr></tbody></table></div></div></section>

    <div v-if="showUserForm" class="modal-backdrop"><div class="modal-panel"><div class="modal-panel-header"><div><p class="page-header-label mb-2">New account</p><h5 class="mb-0">Add application user</h5></div><button class="btn btn-close" @click="showUserForm=false"></button></div><form class="mt-3" @submit.prevent="submitUser"><div class="row g-3"><div class="col-12"><label class="form-label">Full name</label><input v-model="userForm.name" class="form-control" required /></div><div class="col-12"><label class="form-label">Email</label><input v-model="userForm.email" class="form-control" type="email" required /></div><div class="col-12 col-md-6"><label class="form-label">Password</label><input v-model="userForm.password" class="form-control" type="password" minlength="8" required /></div><div class="col-12 col-md-6"><label class="form-label">Role</label><select v-model="userForm.role" class="form-select"><option v-for="role in roles" :key="role" :value="role">{{ roleLabel(role) }}</option></select></div></div><div class="modal-actions"><button type="button" class="btn btn-outline-secondary" @click="showUserForm=false">Cancel</button><button class="btn btn-primary" :disabled="saving">{{ saving ? 'Creating...' : 'Create user' }}</button></div></form></div></div>
    <div v-if="showReview" class="modal-backdrop"><div class="modal-panel confirm-panel"><div class="modal-panel-header"><div><p class="page-header-label mb-2">Financial control</p><h5 class="mb-0">{{ decision === 'approved' ? 'Approve' : 'Reject' }} request</h5></div><button class="btn btn-close" @click="showReview=false"></button></div><p class="review-summary">{{ actionLabel(selectedApproval.action_type) }} requested by <strong>{{ selectedApproval.requested_by_name }}</strong>.</p><label class="form-label">Review note</label><textarea v-model="reviewNote" class="form-control" rows="3" placeholder="Add context for the audit trail"></textarea><div class="modal-actions"><button class="btn btn-outline-secondary" @click="showReview=false">Cancel</button><button class="btn" :class="decision === 'approved' ? 'btn-success' : 'btn-danger'" :disabled="saving" @click="submitReview">{{ saving ? 'Saving...' : decision === 'approved' ? 'Approve request' : 'Reject request' }}</button></div></div></div>
  </DashboardLayout>
</template>

<style scoped>
.access-tabs{display:flex;gap:.35rem;margin-bottom:1rem;padding:.35rem;border:1px solid #ececf1;border-radius:10px;background:#fff}.access-tabs button{display:flex;align-items:center;gap:.45rem;padding:.6rem .8rem;border:0;border-radius:7px;background:transparent;color:#777680;font-size:.73rem}.access-tabs button.active{background:#7659e8;color:#fff}.access-tabs button span{display:grid;place-items:center;min-width:1.25rem;height:1.25rem;border-radius:999px;background:rgba(255,255,255,.2);font-size:.62rem}.panel-heading{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:1rem}.panel-heading .form-select{width:130px}.approval-table{min-width:850px}.user-table{min-width:620px}.approval-status{display:inline-flex;padding:.28rem .55rem;border-radius:999px;font-size:.65rem;text-transform:capitalize}.approval-status.pending{background:#fff5dd;color:#a66a08}.approval-status.approved{background:#eaf9f1;color:#168657}.approval-status.rejected{background:#fff0f1;color:#cf4b58}.review-actions{display:flex;justify-content:flex-end;gap:.4rem}.reviewed-by{color:#8b8a93;font-size:.7rem}.count-pill{padding:.35rem .6rem;border-radius:999px;background:#f0edff;color:#7056dc;font-size:.68rem}.role-select{min-height:34px;padding:0 .55rem;border:1px solid #e5e4ea;border-radius:7px;background:#fff;font-size:.7rem}.access-toggle{display:inline-flex;align-items:center;gap:.4rem;border:0;background:transparent;color:#9a5960;font-size:.7rem}.access-toggle span{width:.5rem;height:.5rem;border-radius:50%;background:#cf4b58}.access-toggle.active{color:#168657}.access-toggle.active span{background:#168657}.review-summary{margin:1rem 0;padding:.75rem;border-radius:8px;background:#fafafa;color:#6d6c74;font-size:.75rem}
</style>
