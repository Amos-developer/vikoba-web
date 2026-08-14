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
import SavingsView from "../views/savings/SavingsView.vue";

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: "login",
      replace: true,
    };
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return {
      name: "dashboard",
      replace: true,
    };
  }

  return true;
});

export default router;


