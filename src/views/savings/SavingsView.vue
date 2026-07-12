<script setup>
import DashboardLayout from "../../layouts/DashboardLayout.vue";
</script>

<template>
  <DashboardLayout page-title="Savings" page-subtitle="Manage member savings">
    <section
      class="page-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4"
    >
      <div>
        <p class="page-header-label">Savings overview</p>
        <h2>Savings</h2>
        <p class="page-header-text text-muted mb-0">
          View savings balances, contributions, and member account progress.
        </p>
      </div>
      <button class="btn btn-primary btn-lg shadow-sm">
        <i class="bi bi-wallet2 me-2"></i>
        Add Deposit
      </button>
    </section>

    <section class="row g-3 mb-4">
      <div class="col-12 col-sm-6 col-xl-4">
        <article class="info-card p-4">
          <small class="info-card-label">Total Savings</small>
          <h3 class="info-card-value">30,000 TZS</h3>
          <p class="text-muted mb-0">Combined savings across members</p>
        </article>
      </div>
      <div class="col-12 col-sm-6 col-xl-4">
        <article class="info-card p-4">
          <small class="info-card-label">Accounts Saved</small>
          <h3 class="info-card-value text-success">18</h3>
          <p class="text-muted mb-0">Members with active savings</p>
        </article>
      </div>
      <div class="col-12 col-sm-6 col-xl-4">
        <article class="info-card p-4">
          <small class="info-card-label">This Month</small>
          <h3 class="info-card-value text-primary">4,800 TZS</h3>
          <p class="text-muted mb-0">Recent deposit volume</p>
        </article>
      </div>
    </section>

    <div class="card panel-card border-0 shadow-sm">
      <div class="card-body">
        <div
          class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3"
        >
          <div>
            <h5 class="mb-2">Savings management is coming soon</h5>
            <p class="text-muted mb-0">
              We are building tools to monitor member deposits, savings targets,
              and withdrawal history.
            </p>
          </div>
          <span class="badge bg-primary py-2 px-3">Coming soon</span>
        </div>
        <div class="rounded-4 p-4 bg-light">
          <p class="mb-0">
            Soon you will be able to review member savings plans, add deposits,
            and track monthly contributions.
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
