<script setup>
import DashboardLayout from "../../layouts/DashboardLayout.vue";
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
          <h3 class="info-card-value">52</h3>
          <p class="text-muted mb-0">Loans currently in the system</p>
        </article>
      </div>
      <div class="col-12 col-sm-6 col-xl-4">
        <article class="info-card p-4">
          <small class="info-card-label">Active Loans</small>
          <h3 class="info-card-value text-success">24</h3>
          <p class="text-muted mb-0">Loans with active repayment</p>
        </article>
      </div>
      <div class="col-12 col-sm-6 col-xl-4">
        <article class="info-card p-4">
          <small class="info-card-label">Pending Approval</small>
          <h3 class="info-card-value text-warning">8</h3>
          <p class="text-muted mb-0">Loans awaiting review</p>
        </article>
      </div>
    </section>

    <div class="card panel-card border-0 shadow-sm">
      <div class="card-body">
        <div
          class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3"
        >
          <div>
            <h5 class="mb-2">Loan management is coming soon</h5>
            <p class="text-muted mb-0">
              We are building a complete loan management experience with
              schedule tracking, borrower details, and repayment history.
            </p>
          </div>
          <span class="badge bg-primary py-2 px-3">Coming soon</span>
        </div>
        <div class="rounded-4 p-4 bg-light">
          <p class="mb-0">
            In the meantime, use the Loans section to review loan balances and
            borrower summaries once available.
          </p>
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
