<script setup>
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import DashboardLayout from "../../layouts/DashboardLayout.vue";
import {
  approveLoan,
  createLoan,
  deleteLoan,
  getLoans,
  updateLoan,
} from "../../services/loan.service.js";
import { useAuthStore } from "../../stores/auth.store.js";

const authStore = useAuthStore();
const { isAdmin } = storeToRefs(authStore);

const loading = ref(false);
const loans = ref([]);
const showModal = ref(false);
const showDeleteModal = ref(false);
const isSubmitting = ref(false);
const editingLoanId = ref(null);
const loanToDelete = ref(null);
const formError = ref("");
const form = ref({
  member_id: "",
  amount: "",
  interest_rate: 10,
  status: "pending",
});

const stats = computed(() => {
  const totalLoans = loans.value.length;
  const approvedLoans = loans.value.filter(
    (loan) => loan.status === "approved",
  ).length;
  const pendingLoans = loans.value.filter(
    (loan) => loan.status !== "approved",
  ).length;

  return {
    totalLoans,
    approvedLoans,
    pendingLoans,
  };
});

const formatCurrency = (value) => {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "TZS",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleString();
};

const resetForm = () => {
  form.value = {
    member_id: "",
    amount: "",
    interest_rate: 10,
    status: "pending",
  };
  editingLoanId.value = null;
  formError.value = "";
};

const openCreateModal = () => {
  resetForm();
  showModal.value = true;
};

const openEditModal = (loan) => {
  editingLoanId.value = loan.id;
  form.value = {
    member_id: loan.member_id ?? "",
    amount: loan.amount ?? "",
    interest_rate: loan.interest_rate ?? 10,
    status: loan.status || "pending",
  };
  formError.value = "";
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const loadLoans = async () => {
  loading.value = true;

  try {
    const response = await getLoans();
    loans.value = response.data?.data || [];
  } catch (error) {
    console.error("Loans fetch failed:", error);
    formError.value = "Unable to load loans right now.";
  } finally {
    loading.value = false;
  }
};

const submitLoan = async () => {
  if (!form.value.member_id || !form.value.amount) {
    formError.value = "Member and amount are required.";
    return;
  }

  isSubmitting.value = true;
  formError.value = "";

  try {
    const payload = {
      member_id: Number(form.value.member_id),
      amount: Number(form.value.amount),
      interest_rate: Number(form.value.interest_rate),
      status: form.value.status,
    };

    if (editingLoanId.value) {
      await updateLoan(editingLoanId.value, payload);
    } else {
      await createLoan(payload);
    }

    await loadLoans();
    closeModal();
  } catch (error) {
    formError.value =
      error.response?.data?.message || "Unable to save this loan.";
  } finally {
    isSubmitting.value = false;
  }
};

const confirmDelete = async () => {
  if (!loanToDelete.value) return;

  isSubmitting.value = true;

  try {
    await deleteLoan(loanToDelete.value.id);
    loanToDelete.value = null;
    showDeleteModal.value = false;
    await loadLoans();
  } catch (error) {
    formError.value =
      error.response?.data?.message || "Unable to delete this loan.";
  } finally {
    isSubmitting.value = false;
  }
};

const approve = async (loan) => {
  try {
    await approveLoan(loan.id);
    await loadLoans();
  } catch (error) {
    formError.value =
      error.response?.data?.message || "Unable to approve the loan.";
  }
};

onMounted(loadLoans);
</script>

<template>
  <DashboardLayout page-title="Loans" page-subtitle="Manage loan accounts">
    <section class="page-header">
      <div class="page-header-copy">
        <p class="page-header-label">Loans dashboard</p>
        <h2>Loans</h2>
        <p class="page-header-text text-muted mb-0">
          Monitor loan activity, approvals, and repayment schedules.
        </p>
      </div>
      <button
        v-if="isAdmin"
        class="btn btn-primary btn-lg shadow-sm"
        @click="openCreateModal"
      >
        <i class="bi bi-plus-lg me-2"></i>
        New Loan
      </button>
    </section>

    <section class="row g-3 mb-4">
      <div class="col-12 col-sm-6 col-xl-4">
        <article class="info-card p-4">
          <small class="info-card-label">Total Loans</small>
          <h3 class="info-card-value">{{ stats.totalLoans }}</h3>
          <p class="text-muted mb-0">Loans currently in the system</p>
        </article>
      </div>
      <div class="col-12 col-sm-6 col-xl-4">
        <article class="info-card p-4">
          <small class="info-card-label">Approved Loans</small>
          <h3 class="info-card-value text-success">
            {{ stats.approvedLoans }}
          </h3>
          <p class="text-muted mb-0">Loans with approved status</p>
        </article>
      </div>
      <div class="col-12 col-sm-6 col-xl-4">
        <article class="info-card p-4">
          <small class="info-card-label">Pending Approval</small>
          <h3 class="info-card-value text-warning">{{ stats.pendingLoans }}</h3>
          <p class="text-muted mb-0">Loans awaiting approval</p>
        </article>
      </div>
    </section>

    <div class="card panel-card border-0 shadow-sm">
      <div class="card-body">
        <div class="panel-head">
          <div>
            <h5 class="mb-2">Loan records from the database</h5>
            <p class="text-muted mb-0">
              Review live loan data for borrowers, approved balances, and
              repayment status.
            </p>
          </div>
          <span class="badge bg-info py-2 px-3">Live data</span>
        </div>

        <div v-if="formError" class="alert alert-warning mt-3 mb-3">
          {{ formError }}
        </div>

        <div class="table-responsive d-none d-md-block">
          <table class="table align-middle mb-0 table-hover">
            <thead class="table-light">
              <tr>
                <th>Borrower</th>
                <th>Amount</th>
                <th>Total Payable</th>
                <th>Remaining</th>
                <th>Status</th>
                <th>Updated</th>
                <th v-if="isAdmin">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td :colspan="isAdmin ? 7 : 6" class="text-center py-5">
                  <div
                    class="d-flex justify-content-center align-items-center gap-2"
                  >
                    <div class="spinner-border text-primary" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    <span>Loading loans...</span>
                  </div>
                </td>
              </tr>
              <tr v-else-if="!loans.length">
                <td :colspan="isAdmin ? 7 : 6" class="text-center py-5">
                  No loan records found.
                </td>
              </tr>
              <tr v-else v-for="loan in loans" :key="loan.id">
                <td>
                  <div class="fw-semibold">
                    {{ loan.first_name }} {{ loan.last_name }}
                  </div>
                  <small class="text-muted">Member #{{ loan.member_id }}</small>
                </td>
                <td>{{ formatCurrency(loan.amount) }}</td>
                <td>{{ formatCurrency(loan.total_payable) }}</td>
                <td>{{ formatCurrency(loan.remaining_balance) }}</td>
                <td>
                  <span
                    :class="[
                      'badge',
                      loan.status === 'approved' ? 'bg-success' : 'bg-warning',
                    ]"
                  >
                    {{ loan.status || "pending" }}
                  </span>
                </td>
                <td>{{ formatDate(loan.updated_at || loan.created_at) }}</td>
                <td v-if="isAdmin">
                  <div class="action-group">
                    <button
                      class="btn btn-sm btn-outline-success"
                      @click="approve(loan)"
                    >
                      Approve
                    </button>
                    <button
                      class="btn btn-sm btn-outline-primary"
                      @click="openEditModal(loan)"
                    >
                      Edit
                    </button>
                    <button
                      class="btn btn-sm btn-outline-danger"
                      @click="
                        loanToDelete = loan;
                        showDeleteModal = true;
                      "
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="loan-card-list d-md-none">
          <div v-if="loading" class="empty-state">Loading loans...</div>
          <div v-else-if="!loans.length" class="empty-state">
            No loan records found.
          </div>
          <article
            v-else
            v-for="loan in loans"
            :key="loan.id"
            class="loan-card"
          >
            <div class="loan-card-header">
              <div>
                <h6 class="mb-1">{{ loan.first_name }} {{ loan.last_name }}</h6>
                <p class="text-muted mb-0">Member #{{ loan.member_id }}</p>
              </div>
              <span
                :class="[
                  'badge',
                  loan.status === 'approved' ? 'bg-success' : 'bg-warning',
                ]"
              >
                {{ loan.status || "pending" }}
              </span>
            </div>
            <dl class="loan-meta">
              <div>
                <dt>Amount</dt>
                <dd>{{ formatCurrency(loan.amount) }}</dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>{{ formatCurrency(loan.total_payable) }}</dd>
              </div>
              <div>
                <dt>Balance</dt>
                <dd>{{ formatCurrency(loan.remaining_balance) }}</dd>
              </div>
              <div>
                <dt>Updated</dt>
                <dd>{{ formatDate(loan.updated_at || loan.created_at) }}</dd>
              </div>
            </dl>
            <div v-if="isAdmin" class="action-group action-group-stack">
              <button
                class="btn btn-sm btn-outline-success"
                @click="approve(loan)"
              >
                Approve
              </button>
              <button
                class="btn btn-sm btn-outline-primary"
                @click="openEditModal(loan)"
              >
                Edit
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="
                  loanToDelete = loan;
                  showDeleteModal = true;
                "
              >
                Delete
              </button>
            </div>
          </article>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-backdrop">
      <div class="modal-panel">
        <div class="modal-panel-header">
          <div>
            <p class="page-header-label mb-2">
              {{ editingLoanId ? "Edit loan" : "New loan" }}
            </p>
            <h5 class="mb-0">
              {{ editingLoanId ? "Update loan details" : "Create a new loan" }}
            </h5>
          </div>
          <button class="btn btn-close" @click="closeModal"></button>
        </div>

        <form class="mt-3" @submit.prevent="submitLoan">
          <div class="row g-3">
            <div class="col-12 col-md-6">
              <label class="form-label">Member ID</label>
              <input
                v-model="form.member_id"
                class="form-control"
                type="number"
                min="1"
                required
              />
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label">Amount</label>
              <input
                v-model="form.amount"
                class="form-control"
                type="number"
                min="1"
                step="0.01"
                required
              />
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label">Interest rate (%)</label>
              <input
                v-model="form.interest_rate"
                class="form-control"
                type="number"
                min="0"
                step="0.1"
              />
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label">Status</label>
              <select v-model="form.status" class="form-select">
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </select>
            </div>
          </div>

          <div class="modal-actions">
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="closeModal"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isSubmitting"
            >
              {{
                isSubmitting
                  ? "Saving..."
                  : editingLoanId
                    ? "Save changes"
                    : "Create loan"
              }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showDeleteModal" class="modal-backdrop">
      <div class="modal-panel confirm-panel">
        <h5 class="mb-3">Delete this loan?</h5>
        <p class="text-muted mb-4">
          This action cannot be undone. The selected loan record will be
          removed.
        </p>
        <div class="modal-actions">
          <button
            class="btn btn-outline-secondary"
            @click="showDeleteModal = false"
          >
            Cancel
          </button>
          <button
            class="btn btn-danger"
            :disabled="isSubmitting"
            @click="confirmDelete"
          >
            {{ isSubmitting ? "Deleting..." : "Delete loan" }}
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.page-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.page-header-copy {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.page-header-label {
  display: inline-flex;
  margin-bottom: 0.1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.78rem;
  font-weight: 700;
  color: #0f766e;
}

.page-header-text {
  max-width: 38rem;
}

.info-card {
  border-radius: 1.5rem;
  background: #ffffff;
  box-shadow: 0 18px 44px rgba(15, 23, 42, 0.08);
}

.info-card-label {
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #64748b;
}

.info-card-value {
  font-size: 2.1rem;
  font-weight: 800;
  margin: 0.8rem 0 0.45rem;
}

.panel-card {
  border-radius: 1.75rem;
}

.panel-head {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.action-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.action-group-stack {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.loan-card-list {
  display: grid;
  gap: 0.85rem;
}

.loan-card {
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 1rem;
  padding: 1rem;
  background: #f8fafc;
}

.loan-card-header {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: start;
}

.loan-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem;
  margin: 0.9rem 0 0;
}

.loan-meta div {
  background: #ffffff;
  border-radius: 0.8rem;
  padding: 0.65rem;
}

.loan-meta dt {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
}

.loan-meta dd {
  margin: 0.2rem 0 0;
  font-weight: 600;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.55);
}

.modal-panel {
  width: min(100%, 40rem);
  background: #ffffff;
  border-radius: 1.2rem;
  padding: 1.25rem;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.2);
}

.confirm-panel {
  width: min(100%, 28rem);
}

.modal-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.empty-state {
  padding: 1.25rem;
  text-align: center;
  color: #64748b;
  border: 1px dashed rgba(15, 23, 42, 0.15);
  border-radius: 1rem;
  background: #f8fafc;
}

.btn-close {
  filter: invert(0.35);
}

@media (min-width: 768px) {
  .page-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .panel-head {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
