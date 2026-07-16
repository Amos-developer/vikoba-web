<script setup>
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import DashboardLayout from "../../layouts/DashboardLayout.vue";
import {
  createSaving,
  deleteSaving,
  getSavings,
  updateSaving,
} from "../../services/savings.service.js";
import { useAuthStore } from "../../stores/auth.store.js";

const authStore = useAuthStore();
const { isAdmin } = storeToRefs(authStore);

const loading = ref(false);
const savings = ref([]);
const showModal = ref(false);
const showDeleteModal = ref(false);
const isSubmitting = ref(false);
const editingSavingId = ref(null);
const savingToDelete = ref(null);
const formError = ref("");
const form = ref({
  member_id: "",
  amount: "",
});

const stats = computed(() => {
  const totalSavings = savings.value.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );
  const accountCount = savings.value.length;

  return {
    totalSavings,
    accountCount,
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

const resetForm = () => {
  form.value = {
    member_id: "",
    amount: "",
  };
  editingSavingId.value = null;
  formError.value = "";
};

const openCreateModal = () => {
  resetForm();
  showModal.value = true;
};

const openEditModal = (saving) => {
  editingSavingId.value = saving.id;
  form.value = {
    member_id: saving.member_id ?? "",
    amount: saving.amount ?? "",
  };
  formError.value = "";
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const loadSavings = async () => {
  loading.value = true;

  try {
    const response = await getSavings();
    savings.value = response.data?.data || [];
  } catch (error) {
    console.error("Savings fetch failed:", error);
    formError.value = "Unable to load savings records right now.";
  } finally {
    loading.value = false;
  }
};

const submitSaving = async () => {
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
    };

    if (editingSavingId.value) {
      await updateSaving(editingSavingId.value, payload);
    } else {
      await createSaving(payload);
    }

    await loadSavings();
    closeModal();
  } catch (error) {
    formError.value =
      error.response?.data?.message || "Unable to save this saving record.";
  } finally {
    isSubmitting.value = false;
  }
};

const confirmDelete = async () => {
  if (!savingToDelete.value) return;

  isSubmitting.value = true;

  try {
    await deleteSaving(savingToDelete.value.id);
    savingToDelete.value = null;
    showDeleteModal.value = false;
    await loadSavings();
  } catch (error) {
    formError.value =
      error.response?.data?.message || "Unable to delete this saving record.";
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(loadSavings);
</script>

<template>
  <DashboardLayout page-title="Savings" page-subtitle="Manage member savings">
    <section class="page-header">
      <div class="page-header-copy">
        <p class="page-header-label">Savings overview</p>
        <h2>Savings</h2>
        <p class="page-header-text text-muted mb-0">
          View savings balances, contributions, and member account progress.
        </p>
      </div>
      <button
        v-if="isAdmin"
        class="btn btn-primary btn-lg shadow-sm"
        @click="openCreateModal"
      >
        <i class="bi bi-wallet2 me-2"></i>
        Add Deposit
      </button>
    </section>

    <section class="row g-3 mb-4">
      <div class="col-12 col-sm-6 col-xl-4">
        <article class="info-card p-4">
          <small class="info-card-label">Total Savings</small>
          <h3 class="info-card-value">
            {{ formatCurrency(stats.totalSavings) }}
          </h3>
          <p class="text-muted mb-0">Combined savings across members</p>
        </article>
      </div>
      <div class="col-12 col-sm-6 col-xl-4">
        <article class="info-card p-4">
          <small class="info-card-label">Accounts Saved</small>
          <h3 class="info-card-value text-success">{{ stats.accountCount }}</h3>
          <p class="text-muted mb-0">Members with active savings</p>
        </article>
      </div>
      <div class="col-12 col-sm-6 col-xl-4">
        <article class="info-card p-4">
          <small class="info-card-label">Latest Records</small>
          <h3 class="info-card-value text-primary">{{ savings.length }}</h3>
          <p class="text-muted mb-0">Recent deposit entries</p>
        </article>
      </div>
    </section>

    <div class="card panel-card border-0 shadow-sm">
      <div class="card-body">
        <div class="panel-head">
          <div>
            <h5 class="mb-2">Member savings records</h5>
            <p class="text-muted mb-0">
              Review deposits, update balances, and remove outdated entries.
            </p>
          </div>
          <span class="badge bg-primary py-2 px-3">Live data</span>
        </div>

        <div v-if="formError" class="alert alert-warning mb-3">
          {{ formError }}
        </div>

        <div class="table-responsive d-none d-md-block">
          <table class="table align-middle mb-0 table-hover">
            <thead class="table-light">
              <tr>
                <th>Member</th>
                <th>Amount</th>
                <th v-if="isAdmin">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td :colspan="isAdmin ? 2 : 1" class="text-center py-5">
                  Loading savings...
                </td>
              </tr>
              <tr v-else-if="!savings.length">
                <td :colspan="isAdmin ? 2 : 1" class="text-center py-5">
                  No savings records found.
                </td>
              </tr>
              <tr v-else v-for="saving in savings" :key="saving.id">
                <td>
                  <div class="fw-semibold">
                    {{ saving.first_name }} {{ saving.last_name }}
                  </div>
                  <small class="text-muted"
                    >Member #{{ saving.member_id }}</small
                  >
                </td>
                <td>{{ formatCurrency(saving.amount) }}</td>
                <td v-if="isAdmin">
                  <div class="action-group">
                    <button
                      class="btn btn-sm btn-outline-primary"
                      @click="openEditModal(saving)"
                    >
                      Edit
                    </button>
                    <button
                      class="btn btn-sm btn-outline-danger"
                      @click="
                        savingToDelete = saving;
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

        <div class="savings-card-list d-md-none">
          <div v-if="loading" class="empty-state">Loading savings...</div>
          <div v-else-if="!savings.length" class="empty-state">
            No savings records found.
          </div>
          <article
            v-else
            v-for="saving in savings"
            :key="saving.id"
            class="savings-card"
          >
            <div class="savings-card-header">
              <div>
                <h6 class="mb-1">
                  {{ saving.first_name }} {{ saving.last_name }}
                </h6>
                <p class="text-muted mb-0">Member #{{ saving.member_id }}</p>
              </div>
              <span class="badge bg-success">{{
                formatCurrency(saving.amount)
              }}</span>
            </div>
            <div v-if="isAdmin" class="action-group action-group-stack">
              <button
                class="btn btn-sm btn-outline-primary"
                @click="openEditModal(saving)"
              >
                Edit
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="
                  savingToDelete = saving;
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
              {{ editingSavingId ? "Edit deposit" : "New deposit" }}
            </p>
            <h5 class="mb-0">
              {{
                editingSavingId
                  ? "Update saving record"
                  : "Create a new deposit"
              }}
            </h5>
          </div>
          <button class="btn-close" @click="closeModal"></button>
        </div>

        <form class="mt-3" @submit.prevent="submitSaving">
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
                  : editingSavingId
                    ? "Save changes"
                    : "Create deposit"
              }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showDeleteModal" class="modal-backdrop">
      <div class="modal-panel confirm-panel">
        <h5 class="mb-3">Delete this saving record?</h5>
        <p class="text-muted mb-4">
          This action removes the selected deposit record from the system.
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
            {{ isSubmitting ? "Deleting..." : "Delete record" }}
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.savings-card-list {
  display: grid;
  gap: 0.85rem;
}

.savings-card {
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 1rem;
  padding: 1rem;
  background: #f8fafc;
}

.savings-card-header {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: start;
  margin-bottom: 0.75rem;
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
  width: min(100%, 32rem);
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
