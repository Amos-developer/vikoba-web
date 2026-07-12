import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "../stores/auth.store";
import LoginView from "../views/auth/LoginView.vue";
import DashboardView from "../views/dashboard/DashboardView.vue";
import MembersView from "../views/members/MembersView.vue";

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
}
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
