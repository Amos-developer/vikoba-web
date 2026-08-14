<script setup>
import { computed, onMounted, ref } from "vue";
import DashboardLayout from "../../layouts/DashboardLayout.vue";
import {
  getDashboardStats,
  getRecentMembers,
  getRecentTransactions,
} from "../../services/dashboard.service";

const loading = ref(true);
const errorMessage = ref("");
const search = ref("");
const stats = ref({ totalMembers: 0, totalSavings: 0, activeLoans: 0 });
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

const isDeposit = (transaction) =>
  ["deposit", "saving"].includes(transaction.transaction_type);
const depositCount = computed(
  () => transactions.value.filter(isDeposit).length,
);
const withdrawalCount = computed(
  () => transactions.value.length - depositCount.value,
);
const filteredMembers = computed(() => {
  const query = search.value.toLowerCase().trim();
  if (!query) return members.value;
  return members.value.filter((member) =>
    `${member.first_name || ""} ${member.last_name || ""} ${member.phone || ""}`
      .toLowerCase()
      .includes(query),
  );
});

const statCards = computed(() => [
  {
    label: "Total members",
    value: formatNumber(stats.value.totalMembers),
    note: `${members.value.length} recently joined`,
    icon: "bi-people",
    tone: "purple",
  },
  {
    label: "Total deposits",
    value: formatCurrency(stats.value.totalSavings),
    note: `${depositCount.value} recent deposits`,
    icon: "bi-arrow-down-left",
    tone: "green",
  },
  {
    label: "Total savings",
    value: formatCurrency(stats.value.totalSavings),
    note: "Current saved amount",
    icon: "bi-wallet2",
    tone: "blue",
  },
  {
    label: "Active loans",
    value: formatNumber(stats.value.activeLoans),
    note: "Open loan accounts",
    icon: "bi-bank",
    tone: "amber",
  },
]);

const fetchDashboard = async () => {
  try {
    loading.value = true;
    errorMessage.value = "";
    const [statsResponse, membersResponse, transactionsResponse] =
      await Promise.all([
        getDashboardStats(),
        getRecentMembers(),
        getRecentTransactions(),
      ]);
    stats.value = unwrapData(statsResponse, stats.value);
    members.value = unwrapArray(membersResponse);
    transactions.value = unwrapArray(transactionsResponse);
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || error.message || "Unable to load dashboard data.";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDashboard);
</script>

<template>
  <DashboardLayout page-title="Dashboard" page-subtitle="Workspace overview">
    <div class="dashboard">
      <div v-if="loading" class="state-panel">
        <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
        <span>Loading your workspace...</span>
      </div>

      <div v-else-if="errorMessage" class="state-panel error-panel">
        <i class="bi bi-exclamation-circle"></i>
        <div><strong>Dashboard unavailable</strong><span>{{ errorMessage }}</span></div>
        <button type="button" @click="fetchDashboard">Try again</button>
      </div>

      <template v-else>
        <section class="section-card stats-section" aria-labelledby="quick-stats">
          <div class="section-bar">
            <div><span class="eyebrow">At a glance</span><h2 id="quick-stats">Quick stats</h2></div>
            <span class="updated"><i class="bi bi-arrow-repeat"></i> Live data</span>
          </div>
          <div class="stats-grid">
            <article v-for="card in statCards" :key="card.label" class="stat-card">
              <div class="stat-label"><span class="stat-icon" :class="card.tone"><i class="bi" :class="card.icon"></i></span>{{ card.label }}</div>
              <strong>{{ card.value }}</strong>
              <span class="stat-note"><i class="bi bi-arrow-up-right"></i>{{ card.note }}</span>
            </article>
          </div>
        </section>

        <section class="content-grid">
          <article class="section-card members-panel">
            <div class="section-bar">
              <div><span class="eyebrow">Directory</span><h2>Recent members</h2></div>
              <span class="number-badge">{{ members.length }}</span>
            </div>
            <label class="search-box">
              <i class="bi bi-search"></i>
              <input v-model="search" type="search" placeholder="Search members" />
            </label>
            <div v-if="filteredMembers.length" class="member-list">
              <div v-for="member in filteredMembers" :key="member.id" class="member-row">
                <span class="avatar">{{ (member.first_name || "M")[0] }}{{ (member.last_name || "")[0] }}</span>
                <div class="member-name"><strong>{{ member.first_name }} {{ member.last_name }}</strong><span>{{ member.phone || "No phone" }}</span></div>
                <button type="button" aria-label="View member" @click="$router.push(`/members/${member.id}`)"><i class="bi bi-chevron-right"></i></button>
              </div>
            </div>
            <div v-else class="empty-row">No members found.</div>
          </article>
        </section>

        <section class="section-card transactions-panel">
          <div class="section-bar transaction-heading">
            <div><span class="eyebrow">Cash flow</span><h2>Recent transactions</h2></div>
            <div class="flow-summary"><span><i class="bi bi-arrow-down-left"></i>{{ depositCount }} in</span><span><i class="bi bi-arrow-up-right"></i>{{ withdrawalCount }} out</span></div>
          </div>
          <div v-if="transactions.length" class="table-scroll">
            <table>
              <thead><tr><th>Member</th><th>Type</th><th>Date</th><th class="amount-cell">Amount</th><th aria-label="Actions"></th></tr></thead>
              <tbody>
                <tr v-for="transaction in transactions" :key="transaction.id">
                  <td><div class="table-member"><span class="mini-avatar">{{ (transaction.member_name || "M")[0] }}</span><strong>{{ transaction.member_name || "Member" }}</strong></div></td>
                  <td><span class="status-pill" :class="isDeposit(transaction) ? 'deposit' : 'withdrawal'">{{ transaction.transaction_type }}</span></td>
                  <td>{{ transaction.created_at ? new Date(transaction.created_at).toLocaleDateString() : "â€”" }}</td>
                  <td class="amount-cell"><strong>{{ formatCurrency(transaction.amount) }}</strong></td>
                  <td><button class="more-button" type="button" aria-label="Transaction options"><i class="bi bi-three-dots"></i></button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="empty-row">No recent transactions.</div>
        </section>
      </template>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.dashboard{display:grid;gap:1rem;color:#18181b}.section-card{min-width:0;background:#fff;border:1px solid #ececf1;border-radius:14px;box-shadow:0 1px 2px rgba(24,24,27,.03)}.section-bar{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem;border-bottom:1px solid #f0f0f3}.section-bar h2{margin:.1rem 0 0;font-size:1rem;line-height:1.2;font-weight:700}.eyebrow{display:block;color:#8a8993;font-size:.68rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em}.updated,.period,.number-badge{display:inline-flex;align-items:center;gap:.35rem;color:#777680;font-size:.74rem}.number-badge{justify-content:center;min-width:1.8rem;height:1.8rem;border-radius:8px;background:#f0edff;color:#7157e8;font-weight:700}.stats-grid{display:grid;grid-template-columns:1fr;gap:.75rem;padding:.75rem}.stat-card{padding:1rem;border:1px solid #ededf2;border-radius:11px;background:linear-gradient(145deg,#fff,#fdfdff)}.stat-label{display:flex;align-items:center;gap:.5rem;color:#777680;font-size:.78rem}.stat-icon{width:1.75rem;height:1.75rem;display:grid;place-items:center;border-radius:7px;background:#f0edff;color:#7559e8}.stat-icon.green{background:#eaf9f1;color:#159a61}.stat-icon.blue{background:#eaf4ff;color:#3585dc}.stat-icon.amber{background:#fff5dd;color:#c78614}.stat-card>strong{display:block;margin:.85rem 0 .35rem;font-size:1.25rem;white-space:nowrap}.stat-note{display:flex;align-items:center;gap:.25rem;color:#85848d;font-size:.69rem}.stat-note i{color:#159a61}.content-grid{display:grid;gap:1rem}.chart-panel,.members-panel{overflow:hidden}.chart-panel :deep(.chart-card){border:0;border-radius:0;box-shadow:none}.chart-panel :deep(.chart-card-header){display:none}.members-panel{display:flex;flex-direction:column}.search-box{display:flex;align-items:center;gap:.5rem;margin:.75rem;padding:.6rem .7rem;border:1px solid #e6e5eb;border-radius:8px;color:#9998a1}.search-box:focus-within{border-color:#8068ec;box-shadow:0 0 0 3px #eeeaff}.search-box input{width:100%;border:0;outline:0;font-size:.78rem;background:transparent}.member-list{padding:0 .75rem .75rem}.member-row{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:.65rem;padding:.65rem 0;border-bottom:1px solid #f1f1f4}.member-row:last-child{border:0}.avatar,.mini-avatar{display:grid;place-items:center;border-radius:50%;background:#eeeaff;color:#6f57d9;font-weight:700}.avatar{width:2.1rem;height:2.1rem;font-size:.72rem}.mini-avatar{width:1.65rem;height:1.65rem;font-size:.65rem}.member-name{min-width:0}.member-name strong,.member-name span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.member-name strong{font-size:.78rem}.member-name span{margin-top:.12rem;color:#919099;font-size:.68rem}.member-row button,.more-button{border:0;background:transparent;color:#9998a1}.transactions-panel{overflow:hidden}.transaction-heading{align-items:flex-end}.flow-summary{display:none;gap:.75rem;font-size:.7rem;color:#777680}.flow-summary span{display:flex;gap:.25rem}.flow-summary span:first-child i{color:#16975f}.flow-summary span:last-child i{color:#df4f5b}.table-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}table{width:100%;min-width:650px;border-collapse:collapse;font-size:.76rem}th{padding:.65rem 1rem;color:#92919a;background:#fafafa;text-align:left;font-size:.68rem;font-weight:500}td{padding:.72rem 1rem;border-top:1px solid #f0f0f3;color:#686770}.table-member{display:flex;align-items:center;gap:.55rem;color:#242328}.status-pill{display:inline-flex;padding:.28rem .55rem;border-radius:999px;text-transform:capitalize;font-size:.67rem}.status-pill.deposit{background:#eaf9f1;color:#168657}.status-pill.withdrawal{background:#fff0f1;color:#d84d5a}.amount-cell{text-align:right;color:#26252b}.more-button{padding:.25rem}.empty-row{padding:2rem;text-align:center;color:#919099;font-size:.8rem}.state-panel{min-height:45vh;display:flex;align-items:center;justify-content:center;gap:.7rem;background:#fff;border:1px solid #ececf1;border-radius:14px;color:#777680}.error-panel{flex-wrap:wrap;padding:2rem}.error-panel div span,.error-panel div strong{display:block}.error-panel button{border:0;border-radius:8px;padding:.55rem .8rem;background:#7559e8;color:#fff}
@media (min-width:560px){.stats-grid{grid-template-columns:repeat(2,1fr)}.flow-summary{display:flex}}
@media (min-width:900px){.stats-grid{grid-template-columns:repeat(4,1fr)}.content-grid{grid-template-columns:minmax(0,1.65fr) minmax(270px,.65fr)}.chart-panel{min-height:390px}}

/* Cash flow replaces the removed deposit chart in the dashboard's primary column. */
.stats-section{order:1}.content-grid{display:contents}.transactions-panel{order:2}.members-panel{order:3}
@media (min-width:900px){.dashboard{grid-template-columns:minmax(0,1.65fr) minmax(270px,.65fr)}.stats-section{grid-column:1/-1}.transactions-panel{grid-column:1}.members-panel{grid-column:2}}
</style>
