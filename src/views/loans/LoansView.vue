<script setup>
import { computed, onMounted, ref } from "vue";
import DashboardLayout from "../../layouts/DashboardLayout.vue";
import { getLoans } from "../../services/loan.service.js";

const loading = ref(false);
const loans = ref([]);

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

const loadLoans = async () => {
  loading.value = true;

  try {
    const response = await getLoans();
    loans.value = response.data?.data || [];
  } catch (error) {
    console.error("Loans fetch failed:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(loadLoans);
</script>

<template>
  <DashboardLayout page-title="Loans" page-subtitle="Manage loan accounts">
    <section
      class="page-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4"
    >
      <div>
        <p class="page-header-label">Loans dashboard</p>
        <h2>Loans</h2>
        <p class="page-header-text text-muted mb-0">
          Monitor loan activity, approvals, and repayment schedules.
        </p>
      </div>
      <button class="btn btn-primary btn-lg shadow-sm">
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
        <div
          class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3"
        >
          <div>
            <h5 class="mb-2">Loan records from the database</h5>
            <p class="text-muted mb-0">
              Review live loan data for borrowers, approved balances, and
              repayment status.
            </p>
          </div>
          <span class="badge bg-info py-2 px-3">Live data</span>
        </div>

        <div class="table-responsive">
          <table class="table align-middle mb-0 table-hover">
            <thead class="table-light">
              <tr>
                <th>Borrower</th>
                <th>Amount</th>
                <th>Total Payable</th>
                <th>Remaining</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="5" class="text-center py-5">
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
                <td colspan="5" class="text-center py-5">
                  No loan records found.
                </td>
              </tr>
              <tr v-else v-for="loan in loans" :key="loan.id">
                <td>{{ loan.first_name }} {{ loan.last_name }}</td>
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
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.page-header {
  padding: 1.25rem 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.page-header-label {
  display: inline-flex;
  margin-bottom: 0.75rem;
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

@media (max-width: 767px) {
  .page-header {
    padding-bottom: 0.75rem;
  }

  .page-header-text {
    max-width: 100%;
  }
}
</style>
