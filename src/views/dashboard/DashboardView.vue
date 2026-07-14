<script setup>
import { computed, onMounted, ref } from "vue";
import ChartCard from "../../components/ChartCard.vue";
import DashboardLayout from "../../layouts/DashboardLayout.vue";

import {
  getDashboardStats,
  getRecentMembers,
  getRecentTransactions,
} from "../../services/dashboard.service";

const loading = ref(true);
const errorMessage = ref("");

const stats = ref({
  totalMembers: 0,
  totalSavings: 0,
  activeLoans: 0,
});

const members = ref([]);
const transactions = ref([]);

const formatNumber = (value) => Number(value || 0).toLocaleString();
const formatCurrency = (value) => `${formatNumber(value)} TZS`;
const unwrapData = (response, fallback) =>
  response?.data?.data ?? response?.data ?? fallback;
const unwrapArray = (response) => {
  const value = unwrapData(response, []);
  return Array.isArray(value) ? value : [];
};

const depositCount = computed(
  () =>
    transactions.value.filter(
      (transaction) => transaction.transaction_type === "deposit",
    ).length,
);

const withdrawalCount = computed(
  () =>
    transactions.value.filter(
      (transaction) => transaction.transaction_type !== "deposit",
    ).length,
);

const fetchDashboard = async () => {
  try {
    loading.value = true;
    errorMessage.value = "";

    const [statsRes, membersRes, transactionsRes] = await Promise.all([
      getDashboardStats(),
      getRecentMembers(),
      getRecentTransactions(),
    ]);

    stats.value = unwrapData(statsRes, {
      totalMembers: 0,
      totalSavings: 0,
      activeLoans: 0,
    });

    members.value = unwrapArray(membersRes);

    transactions.value = unwrapArray(transactionsRes);
  } catch (error) {
    console.error("Dashboard Error:", error);
    errorMessage.value =
      error.response?.data?.message ||
      error.message ||
      "Unable to load dashboard data.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDashboard();
});

// local reactive used for filtering UI only
const search = ref("");
const filteredMembers = computed(() => {
  const q = (search.value || "").toLowerCase().trim();
  if (!q) return members.value;
  return members.value.filter((m) => {
    const name = `${m.first_name || ""} ${m.last_name || ""}`.toLowerCase();
    return name.includes(q) || (m.phone || "").includes(q);
  });
});
</script>

<template>
  <DashboardLayout>
    <div v-if="loading" class="dashboard-shell">
      <div class="loading-state">
        <div class="loading-mark">
          <span class="spinner-border"></span>
        </div>
        <p>Loading dashboard...</p>
      </div>
    </div>

    <div v-else-if="errorMessage" class="dashboard-shell">
      <div class="error-state">
        <div class="error-icon">
          <i class="bi bi-exclamation-triangle"></i>
        </div>
        <h2>Dashboard data failed to load</h2>
        <p>{{ errorMessage }}</p>
        <button class="retry-button" type="button" @click="fetchDashboard">
          <i class="bi bi-arrow-clockwise"></i>
          Retry
        </button>
      </div>
    </div>

    <div v-else class="dashboard-shell">
      <!-- Hero stat cards -->
      <section class="stat-cards" aria-label="Top statistics">
        <div class="stat-card">
          <div class="stat-body">
            <small class="stat-kicker">Total Users</small>
            <div class="stat-value">{{ formatNumber(stats.totalMembers) }}</div>
            <div class="stat-sub">{{ members.length }} joined recently</div>
          </div>
          <div class="stat-icon"><i class="bi bi-people-fill"></i></div>
        </div>

        <div class="stat-card">
          <div class="stat-body">
            <small class="stat-kicker">Total Deposit</small>
            <div class="stat-value large">
              {{ formatNumber(stats.totalSavings) }} TZS
            </div>
            <div class="stat-sub">{{ depositCount }} deposits</div>
          </div>
          <div class="stat-icon"><i class="bi bi-wallet2"></i></div>
        </div>

        <div class="stat-card">
          <div class="stat-body">
            <small class="stat-kicker">Total Savings</small>
            <div class="stat-value large">
              {{ formatNumber(stats.totalSavings) }} TZS
            </div>
            <div class="stat-sub">Total saved amount</div>
          </div>
          <div class="stat-icon"><i class="bi bi-wallet2"></i></div>
        </div>

        <div class="stat-card">
          <div class="stat-body">
            <small class="stat-kicker">Total Loans</small>
            <div class="stat-value">{{ formatNumber(stats.activeLoans) }}</div>
            <div class="stat-sub">Active loan accounts</div>
          </div>
          <div class="stat-icon"><i class="bi bi-bank2"></i></div>
        </div>
      </section>

      <!-- Chart + Right column layout -->
      <section class="visual-grid">
        <div class="chart-wrap">
          <article class="dashboard-card chart-panel">
            <div class="section-heading">
              <div>
                <span class="section-kicker">Deposit Volume</span>
                <h2>Credited deposits during the last 14 days</h2>
              </div>
              <a class="view-all" href="#">View All</a>
            </div>

            <ChartCard :transactions="transactions" :days="14" />
          </article>
        </div>

        <aside class="right-column">
          <article class="dashboard-card members-panel sticky-members">
            <div class="section-heading">
              <div>
                <span class="section-kicker">Recent Accounts</span>
                <h2>Recent Members</h2>
              </div>
              <span class="count-badge">{{ members.length }}</span>
            </div>

            <div class="members-search">
              <input
                v-model="search"
                class="form-control"
                placeholder="Search members..."
              />
            </div>

            <div v-if="filteredMembers.length" class="member-list">
              <div v-for="m in filteredMembers" :key="m.id" class="member-row">
                <div class="avatar">
                  {{ (m.first_name || "M").charAt(0)
                  }}{{ (m.last_name || "").charAt(0) }}
                </div>
                <div class="member-info">
                  <strong>{{ m.first_name }} {{ m.last_name }}</strong>
                  <span>{{ m.phone }}</span>
                </div>
                <div class="member-actions">
                  <button
                    class="btn-ghost"
                    @click.prevent="$router.push(`/members/${m.id}`)"
                  >
                    View
                  </button>
                  <button class="btn-ghost secondary" @click.prevent>
                    Msg
                  </button>
                </div>
              </div>
            </div>

            <div v-else class="empty-state">
              <i class="bi bi-person-plus"></i>
              <span>No members found</span>
            </div>
          </article>
        </aside>
      </section>

      <section class="transactions-full">
        <article class="dashboard-card transactions-panel">
          <div class="section-heading">
            <div>
              <span class="section-kicker">Cash flow</span>
              <h2>Recent Transactions</h2>
            </div>
            <div class="transaction-summary">
              <span
                ><i class="bi bi-arrow-down-left"></i>{{ depositCount }}</span
              >
              <span
                ><i class="bi bi-arrow-up-right"></i>{{ withdrawalCount }}</span
              >
            </div>
          </div>

          <div v-if="transactions.length" class="transaction-list">
            <div v-for="t in transactions" :key="t.id" class="transaction-row">
              <div class="transaction-main">
                <div
                  class="transaction-icon"
                  :class="
                    t.transaction_type === 'deposit'
                      ? 'deposit-icon'
                      : 'withdrawal-icon'
                  "
                >
                  <i
                    class="bi"
                    :class="
                      t.transaction_type === 'deposit'
                        ? 'bi-arrow-down-left'
                        : 'bi-arrow-up-right'
                    "
                  ></i>
                </div>
                <div>
                  <strong>{{ t.member_name }}</strong>
                  <span
                    class="type-badge"
                    :class="
                      t.transaction_type === 'deposit'
                        ? 'deposit-badge'
                        : 'withdrawal-badge'
                    "
                  >
                    {{ t.transaction_type }}
                  </span>
                </div>
              </div>

              <strong class="amount">{{ formatCurrency(t.amount) }}</strong>
            </div>
          </div>

          <div v-else class="empty-state">
            <i class="bi bi-receipt"></i>
            <span>No transactions found</span>
          </div>
        </article>
      </section>
    </div>
  </DashboardLayout>
</template>

<style scoped>
:root {
  --muted: #64748b;
  --card-bg: linear-gradient(180deg, #ffffff, #fbfdff);
  --accent: #2563eb;
  --surface: #f8fbff;
}
.dashboard-shell {
  min-height: calc(100vh - 86px);
  padding: clamp(0.75rem, 2vw, 1.5rem);
  border-radius: 22px;
  background: linear-gradient(135deg, #f7faf9 0%, #eef4f6 100%);
  color: #0f172a;
}
.loading-state,
.error-state {
  min-height: 56vh;
  display: grid;
  place-items: center;
  gap: 1rem;
  color: var(--muted);
}
.loading-mark {
  width: 78px;
  height: 78px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 18px 42px rgba(16, 24, 40, 0.08);
}
.retry-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.1rem;
  border-radius: 10px;
  background: #0f766e;
  color: #fff;
  border: 0;
  font-weight: 800;
  cursor: pointer;
}

/* Stat cards */
.stat-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1.15rem;
}
.stat-card {
  position: relative;
  padding: 1rem;
  border-radius: 20px;
  background: var(--card-bg);
  box-shadow: 0 14px 42px rgba(15, 23, 42, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.14);
}
.stat-body .stat-kicker {
  color: var(--muted);
  font-weight: 800;
  font-size: 0.82rem;
}
.stat-value {
  font-size: 1.7rem;
  font-weight: 900;
  margin-top: 0.35rem;
}
.stat-value.large {
  font-size: 2rem;
  color: var(--accent);
}
.stat-sub {
  color: var(--muted);
  font-size: 0.9rem;
  margin-top: 0.4rem;
}
.stat-icon {
  position: absolute;
  right: 18px;
  top: 16px;
  background: rgba(37, 99, 235, 0.08);
  padding: 0.7rem;
  border-radius: 14px;
  color: var(--accent);
}

.visual-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  align-items: start;
  margin-bottom: 1rem;
}
.chart-wrap {
  min-width: 0;
}
.right-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.sticky-members {
  position: sticky;
  top: 92px;
}

.dashboard-card {
  padding: 0.95rem;
  border-radius: 18px;
  background: var(--card-bg);
  box-shadow: 0 10px 30px rgba(16, 24, 40, 0.08);
}
.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}
.section-heading h2 {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.2;
}
.section-kicker {
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}

.balance-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.1rem;
  margin-top: 0.85rem;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff, #f4f9ff);
}
.balance-left {
  display: flex;
  gap: 0.9rem;
  align-items: center;
}
.balance-icon {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: #e6f6ff;
  color: #0369a1;
  font-weight: 900;
}
.balance-left strong {
  display: block;
  margin-bottom: 0.2rem;
}
.balance-left .muted {
  color: var(--muted);
  font-size: 0.9rem;
}
.balance-amount {
  font-weight: 900;
  color: #0f172a;
}

.members-search {
  padding: 0.85rem 0 0;
}
.form-control {
  width: 100%;
  min-height: 46px;
  padding: 0.95rem 1rem;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  font-size: 0.95rem;
  color: #0f172a;
  background: #f9fbff;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}
.form-control:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

.member-list {
  display: grid;
  gap: 0.72rem;
  margin-top: 0.9rem;
}
.member-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.95rem;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff, #f5f9ff);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}
.member-row:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 28px rgba(16, 24, 40, 0.08);
}
.avatar {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: #ccfbf1;
  color: #0f766e;
  font-weight: 900;
}
.member-info strong {
  color: #0f172a;
  display: block;
}
.member-info span {
  display: block;
  color: var(--muted);
  font-size: 0.9rem;
  margin-top: 0.18rem;
}

.member-actions {
  margin-left: auto;
  display: flex;
  gap: 0.45rem;
}
.btn-ghost {
  background: transparent;
  border: 1px solid rgba(15, 23, 42, 0.08);
  padding: 0.45rem 0.85rem;
  border-radius: 12px;
  font-weight: 800;
  color: #0f172a;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease;
}
.btn-ghost:hover {
  transform: translateY(-1px);
  background: rgba(37, 99, 235, 0.08);
  border-color: rgba(37, 99, 235, 0.16);
}
.btn-ghost.secondary {
  color: #0369a1;
  border-color: rgba(3, 105, 161, 0.16);
}

.empty-state {
  display: grid;
  place-items: center;
  text-align: center;
  gap: 0.65rem;
  padding: 1.2rem 1rem;
  border-radius: 16px;
  color: var(--muted);
  background: rgba(37, 99, 235, 0.06);
  margin-top: 0.85rem;
}
.empty-state i {
  font-size: 1.35rem;
  color: #2563eb;
}

.transaction-summary {
  display: flex;
  gap: 1rem;
  align-items: center;
  color: var(--muted);
  font-size: 0.95rem;
}
.transaction-summary span {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}
.transaction-list {
  display: grid;
  gap: 0.8rem;
  margin-top: 0.85rem;
}
.transaction-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff, #f7fbff);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}
.transaction-row:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 30px rgba(16, 24, 40, 0.08);
}
.transaction-main {
  display: flex;
  gap: 0.85rem;
  align-items: center;
}
.transaction-icon {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.06);
}
.deposit-icon {
  background: #ecfdf5;
  color: #047857;
}
.withdrawal-icon {
  background: #fff1f2;
  color: #be123c;
}
.type-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.78rem;
  padding: 0.28rem 0.65rem;
  border-radius: 999px;
  margin-top: 0.32rem;
  text-transform: capitalize;
}
.amount {
  font-weight: 900;
  color: #0f172a;
}

.chart-panel {
  padding: 0.95rem 1rem 1rem;
}
.view-all {
  color: var(--accent);
  font-weight: 800;
  text-decoration: none;
  transition: color 0.2s ease;
}
.view-all:hover {
  color: #1d4ed8;
}
.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.09);
  color: #1d4ed8;
  font-weight: 800;
}

.transactions-full {
  margin-top: 1.15rem;
}

@media (min-width: 576px) {
  .stat-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 768px) {
  .stat-cards {
    grid-template-columns: repeat(4, 1fr);
  }
  .visual-grid {
    grid-template-columns: 1fr 360px;
  }
}
</style>
