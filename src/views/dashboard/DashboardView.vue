<script setup>
import { ref, onMounted, computed } from "vue";
import DashboardLayout from "../../layouts/DashboardLayout.vue";

import {
  getDashboardStats,
  getRecentMembers,
  getRecentTransactions
} from "../../services/dashboard.service";

const loading = ref(true);
const errorMessage = ref("");

const stats = ref({
  totalMembers: 0,
  totalSavings: 0,
  activeLoans: 0
});

const members = ref([]);
const transactions = ref([]);

const formatNumber = (value) => Number(value || 0).toLocaleString();
const formatCurrency = (value) => `${formatNumber(value)} TZS`;
const unwrapData = (response, fallback) => response?.data?.data ?? response?.data ?? fallback;
const unwrapArray = (response) => {
  const value = unwrapData(response, []);
  return Array.isArray(value) ? value : [];
};

const depositCount = computed(() =>
  transactions.value.filter((transaction) => transaction.transaction_type === "deposit").length
);

const withdrawalCount = computed(() =>
  transactions.value.filter((transaction) => transaction.transaction_type !== "deposit").length
);

const fetchDashboard = async () => {
  try {
    loading.value = true;
    errorMessage.value = "";

    const [
      statsRes,
      membersRes,
      transactionsRes
    ] = await Promise.all([
      getDashboardStats(),
      getRecentMembers(),
      getRecentTransactions()
    ]);

    stats.value = unwrapData(statsRes, {
      totalMembers: 0,
      totalSavings: 0,
      activeLoans: 0
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
      

      <section class="stats-grid" aria-label="Dashboard statistics">
        <article class="stat-card members-card">
          <div class="stat-topline">
            <span class="stat-icon">
              <i class="bi bi-people-fill"></i>
            </span>
            <span class="trend-pill positive">
              <i class="bi bi-arrow-up-right"></i>
              Active
            </span>
          </div>
          <div>
            <p>Total Members</p>
            <h2>{{ formatNumber(stats.totalMembers) }}</h2>
          </div>
        </article>

        <article class="stat-card savings-card">
          <div class="stat-topline">
            <span class="stat-icon">
              <i class="bi bi-wallet2"></i>
            </span>
            <span class="trend-pill positive">
              <i class="bi bi-shield-check"></i>
              Secure
            </span>
          </div>
          <div>
            <p>Total Savings</p>
            <h2>{{ formatCurrency(stats.totalSavings) }}</h2>
          </div>
        </article>

        <article class="stat-card loans-card">
          <div class="stat-topline">
            <span class="stat-icon">
              <i class="bi bi-bank2"></i>
            </span>
            <span class="trend-pill attention">
              <i class="bi bi-clock-history"></i>
              Current
            </span>
          </div>
          <div>
            <p>Active Loans</p>
            <h2>{{ formatNumber(stats.activeLoans) }}</h2>
          </div>
        </article>
      </section>

      <section class="content-grid">
        <article class="dashboard-card members-panel">
          <div class="section-heading">
            <div>
              <span class="section-kicker">People</span>
              <h2>Recent Members</h2>
            </div>
            <span class="count-badge">{{ members.length }}</span>
          </div>

          <div v-if="members.length" class="member-list">
            <div v-for="m in members" :key="m.id" class="member-row">
              <div class="avatar">
                {{ (m.first_name || "M").charAt(0) }}{{ (m.last_name || "").charAt(0) }}
              </div>
              <div class="member-info">
                <strong>{{ m.first_name }} {{ m.last_name }}</strong>
                <span>{{ m.phone }}</span>
              </div>
              <i class="bi bi-chevron-right"></i>
            </div>
          </div>

          <div v-else class="empty-state">
            <i class="bi bi-person-plus"></i>
            <span>No members found</span>
          </div>
        </article>

        <article class="dashboard-card transactions-panel">
          <div class="section-heading">
            <div>
              <span class="section-kicker">Cash flow</span>
              <h2>Recent Transactions</h2>
            </div>
            <div class="transaction-summary">
              <span><i class="bi bi-arrow-down-left"></i>{{ depositCount }}</span>
              <span><i class="bi bi-arrow-up-right"></i>{{ withdrawalCount }}</span>
            </div>
          </div>

          <div v-if="transactions.length" class="transaction-list">
            <div v-for="t in transactions" :key="t.id" class="transaction-row">
              <div class="transaction-main">
                <div
                  class="transaction-icon"
                  :class="t.transaction_type === 'deposit' ? 'deposit-icon' : 'withdrawal-icon'"
                >
                  <i
                    class="bi"
                    :class="t.transaction_type === 'deposit'
                      ? 'bi-arrow-down-left'
                      : 'bi-arrow-up-right'"
                  ></i>
                </div>
                <div>
                  <strong>{{ t.member_name }}</strong>
                  <span
                    class="type-badge"
                    :class="t.transaction_type === 'deposit' ? 'deposit-badge' : 'withdrawal-badge'"
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
.dashboard-shell {
  min-height: calc(100vh - 86px);
  padding: clamp(0.5rem, 2vw, 1rem);
  border-radius: 24px;
  background:
    radial-gradient(circle at top left, rgba(32, 201, 151, 0.16), transparent 32rem),
    linear-gradient(135deg, #f7faf9 0%, #eef4f6 100%);
  color: #17212b;
}

.loading-state {
  min-height: 58vh;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 1rem;
  color: #52616f;
}

.error-state {
  min-height: 58vh;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 0.85rem;
  color: #52616f;
  text-align: center;
}

.error-state h2 {
  margin: 0;
  color: #17212b;
  font-size: clamp(1.35rem, 6vw, 2rem);
  font-weight: 850;
}

.error-state p {
  max-width: 520px;
  margin: 0;
}

.error-icon {
  width: 76px;
  height: 76px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: #fff1f2;
  color: #be123c;
  font-size: 2rem;
}

.retry-button {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.72rem 1rem;
  border: 0;
  border-radius: 8px;
  background: #0f766e;
  color: #ffffff;
  font-weight: 800;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.retry-button:hover {
  transform: translateY(-1px);
  background: #115e59;
}

.loading-mark {
  width: 76px;
  height: 76px;
  display: grid;
  place-items: center;
  border-radius: 22px;
  background: #ffffff;
  box-shadow: 0 18px 45px rgba(24, 54, 78, 0.12);
}

.loading-mark .spinner-border {
  width: 2.35rem;
  height: 2.35rem;
  color: #0f766e;
}

.dashboard-hero {
  position: relative;
  overflow: hidden;
  display: grid;
  gap: 1.25rem;
  align-items: end;
  padding: clamp(0.75rem, 2vw, 1.25rem);
  margin-bottom: 1rem;
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(9, 30, 39, 0.93), rgba(13, 76, 82, 0.92)),
    url("https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=80");
  background-size: cover;
  background-position: center;
  color: #ffffff;
  box-shadow: 0 24px 70px rgba(17, 37, 49, 0.16);
  animation: liftIn 0.55s ease both;
}

.dashboard-hero::after {
  content: "";
  position: absolute;
  inset: auto 0 0;
  height: 5px;
  background: linear-gradient(90deg, #22c55e, #14b8a6, #f59e0b);
}

.hero-copy,
.hero-panel {
  position: relative;
  z-index: 1;
}

.eyebrow,
.section-kicker {
  display: block;
  margin-bottom: 0.35rem;
  color: #5d7282;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.hero-copy .eyebrow {
  color: #9de8d6;
}

.hero-copy h1 {
  max-width: 760px;
  margin: 0;
  font-size: clamp(2rem, 7vw, 4rem);
  line-height: 1;
  font-weight: 800;
  letter-spacing: 0;
}

.hero-copy p {
  max-width: 620px;
  margin: 0.9rem 0 0;
  color: rgba(255, 255, 255, 0.76);
  font-size: 1rem;
}

.hero-panel {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
}

.panel-icon {
  width: 48px;
  height: 48px;
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.14);
  color: #9de8d6;
  font-size: 1.45rem;
}

.hero-panel span {
  display: block;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.82rem;
}

.hero-panel strong {
  display: block;
  margin-top: 0.15rem;
  color: #ffffff;
  font-size: clamp(1.1rem, 5vw, 1.65rem);
  line-height: 1.2;
}

.stats-grid,
.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.stats-grid {
  margin-bottom: 1rem;
}

.stat-card,
.dashboard-card {
  border: 1px solid rgba(30, 56, 73, 0.08);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 18px 50px rgba(25, 48, 65, 0.08);
}

.stat-card {
  position: relative;
  overflow: hidden;
  min-height: 168px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.75rem;
  animation: liftIn 0.55s ease both;
}

.stat-card:nth-child(2) {
  animation-delay: 0.08s;
}

.stat-card:nth-child(3) {
  animation-delay: 0.16s;
}

.stat-card::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 5px;
}

.members-card::before {
  background: #2563eb;
}

.savings-card::before {
  background: #0f9f6e;
}

.loans-card::before {
  background: #d97706;
}

.stat-topline,
.section-heading,
.transaction-main {
  display: flex;
  align-items: center;
}

.stat-topline,
.section-heading {
  justify-content: space-between;
  gap: 1rem;
}

.stat-icon {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: #ffffff;
  font-size: 1.25rem;
}

.members-card .stat-icon {
  background: #2563eb;
}

.savings-card .stat-icon {
  background: #0f9f6e;
}

.loans-card .stat-icon {
  background: #d97706;
}

.trend-pill,
.count-badge,
.transaction-summary span,
.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 800;
}

.trend-pill,
.count-badge,
.transaction-summary span {
  padding: 0.35rem 0.65rem;
}

.trend-pill.positive {
  color: #047857;
  background: #dcfce7;
}

.trend-pill.attention {
  color: #a16207;
  background: #fef3c7;
}

.stat-card p {
  margin: 1rem 0 0.2rem;
  color: #64748b;
  font-weight: 700;
}

.stat-card h2 {
  margin: 0;
  color: #111827;
  font-size: clamp(1.7rem, 8vw, 2.35rem);
  line-height: 1.05;
  font-weight: 850;
  word-break: break-word;
}

.dashboard-card {
  overflow: hidden;
  padding: 0.75rem;
  animation: liftIn 0.55s ease 0.12s both;
}

.section-heading {
  padding-bottom: 0.65rem;
  border-bottom: 1px solid rgba(30, 56, 73, 0.08);
}

.section-heading h2 {
  margin: 0;
  color: #17212b;
  font-size: 1.08rem;
  font-weight: 850;
}

.count-badge {
  color: #155e75;
  background: #cffafe;
}

.transaction-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.transaction-summary span:first-child {
  color: #047857;
  background: #dcfce7;
}

.transaction-summary span:last-child {
  color: #be123c;
  background: #ffe4e6;
}

.member-list,
.transaction-list {
  display: grid;
  gap: 0.72rem;
  padding-top: 0.65rem;
}

.member-row,
.transaction-row {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.6rem;
  border: 1px solid rgba(30, 56, 73, 0.08);
  border-radius: 8px;
  background: #ffffff;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.member-row:hover,
.transaction-row:hover {
  transform: translateY(-2px);
  border-color: rgba(20, 184, 166, 0.35);
  box-shadow: 0 12px 30px rgba(25, 48, 65, 0.1);
}

.avatar,
.transaction-icon {
  width: 42px;
  height: 42px;
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 8px;
  font-weight: 850;
}

.avatar {
  color: #0f766e;
  background: #ccfbf1;
  text-transform: uppercase;
}

.member-info,
.transaction-main > div:last-child {
  display: grid;
  min-width: 0;
}

.member-info strong,
.transaction-main strong {
  overflow: hidden;
  color: #17212b;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.member-info span {
  overflow: hidden;
  color: #64748b;
  font-size: 0.88rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.member-row > i {
  margin-left: auto;
  color: #94a3b8;
}

.transaction-row {
  justify-content: space-between;
  align-items: flex-start;
}

.transaction-main {
  min-width: 0;
  gap: 0.75rem;
}

.deposit-icon {
  color: #047857;
  background: #dcfce7;
}

.withdrawal-icon {
  color: #be123c;
  background: #ffe4e6;
}

.type-badge {
  width: fit-content;
  margin-top: 0.32rem;
  padding: 0.28rem 0.58rem;
  text-transform: capitalize;
}

.deposit-badge {
  color: #047857;
  background: #ecfdf5;
}

.withdrawal-badge {
  color: #be123c;
  background: #fff1f2;
}

.amount {
  flex: 0 0 auto;
  color: #17212b;
  font-size: 0.94rem;
  text-align: right;
}

.empty-state {
  min-height: 170px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 0.7rem;
  color: #64748b;
  text-align: center;
}

.empty-state i {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: #f1f5f9;
  color: #0f766e;
  font-size: 1.6rem;
}

@keyframes liftIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 576px) {
  .dashboard-hero {
    min-height: 320px;
  }

  .transaction-row {
    align-items: center;
  }
}

@media (min-width: 768px) {
  .dashboard-shell {
    padding: 2rem;
  }

  .stats-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .hero-panel {
    max-width: 360px;
  }
}

@media (min-width: 1200px) {
  .dashboard-hero {
    grid-template-columns: minmax(0, 1fr) 360px;
  }

  .content-grid {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  }
}

@media (max-width: 420px) {
  .dashboard-shell {
    padding: 0.8rem;
    border-radius: 16px;
  }

  .dashboard-hero,
  .stat-card,
  .dashboard-card {
    border-radius: 8px;
  }

  .transaction-row {
    display: grid;
  }

  .amount {
    width: 100%;
    text-align: left;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
