import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "../stores/auth.store";
import LoginView from "../views/auth/LoginView.vue";
import DashboardView from "../views/dashboard/DashboardView.vue";
import LoansView from "../views/loans/LoansView.vue";
import MembersView from "../views/Members/MembersView.vue";
import PenaltiesView from "../views/penalties/PenaltiesView.vue";
import TransactionsView from "../views/transactions/TransactionsView.vue";
import RepaymentsView from "../views/repayments/RepaymentsView.vue";
import ReportsView from "../views/reports/ReportsView.vue";
import AccessView from "../views/admin/AccessView.vue";
import MeetingsView from "../views/meetings/MeetingsView.vue";
import SocialFundView from "../views/social-fund/SocialFundView.vue";
import SavingsView from "../views/savings/SavingsView.vue";
import CyclesView from "../views/cycles/CyclesView.vue";
import ExpensesView from "../views/expenses/ExpensesView.vue";
import ShareoutView from "../views/shareout/ShareoutView.vue";
import IncomeView from "../views/income/IncomeView.vue";
import AuditLogsView from "../views/audit/AuditLogsView.vue";
import SharesView from "../views/shares/SharesView.vue";
import BillingView from "../views/billing/BillingView.vue";
import TrialSignupView from "../views/auth/TrialSignupView.vue";
import SignInView from "../views/auth/SignInView.vue";

const routes = [
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: {
      guestOnly: true,
    },
  },
  {
    path: "/",
    name: "dashboard",
    component: DashboardView,
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/members",
    name: "Members",
    component: MembersView,
    meta: { requiresAuth: true },
  },
  {
    path: "/savings",
    name: "Savings",
    component: SavingsView,
    meta: { requiresAuth: true },
  },

  {
    path: "/shares",
    name: "Shares",
    component: SharesView,
    meta: { requiresAuth: true },
  },
  { path:"/sign-in",name:"signIn",component:SignInView,meta:{guestOnly:true} },
  { path:"/start-trial",name:"startTrial",component:TrialSignupView,meta:{guestOnly:true} },
  {
    path: "/audit-logs",
    name: "AuditLogs",
    component: AuditLogsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/income",
    name: "Income",
    component: IncomeView,
    meta: { requiresAuth: true },
  },
  {
    path: "/share-out",
    name: "ShareOut",
    component: ShareoutView,
    meta: { requiresAuth: true },
  },
  {
    path: "/expenses",
    name: "Expenses",
    component: ExpensesView,
    meta: { requiresAuth: true },
  },
  {
    path: "/cycles",
    name: "Cycles",
    component: CyclesView,
    meta: { requiresAuth: true },
  },
  {
    path: "/loans",
    name: "Loans",
    component: LoansView,
    meta: { requiresAuth: true },
  },
  {
    path: "/penalties",
    name: "Penalties",
    component: PenaltiesView,
    meta: { requiresAuth: true },
  },
  {
    path: "/transactions",
    name: "Transactions",
    component: TransactionsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/repayments",
    name: "Repayments",
    component: RepaymentsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/reports",
    name: "Reports",
    component: ReportsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/access",
    name: "Access",
    component: AccessView,
    meta: { requiresAuth: true },
  },
  {
    path: "/meetings",
    name: "Meetings",
    component: MeetingsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/social-fund",
    name: "SocialFund",
    component: SocialFundView,
    meta: { requiresAuth: true },
  },
  { path:"/billing",name:"Billing",component:BillingView,meta:{requiresAuth:true} },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const authStore = useAuthStore();

  const hasValidSession = authStore.validateSession();
  if (to.meta.requiresAuth && !hasValidSession) {
    return {
      name: "signIn",
      replace: true,
    };
  }

  if (to.meta.guestOnly && hasValidSession) {
    return {
      name: "dashboard",
      replace: true,
    };
  }

  return true;
});

export default router;
