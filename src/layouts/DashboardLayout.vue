<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "../stores/auth.store";

const router = useRouter();
const authStore = useAuthStore();
const isOpen = ref(false);

const navItems = [
  {
    label: "Dashboard",
    icon: "bi-speedometer2",
    href: "#",
    active: true,
  },
  {
    label: "Members",
    icon: "bi-people",
    href: "#",
    active: false,
  },
  {
    label: "Savings",
    icon: "bi-wallet2",
    href: "#",
    active: false,
  },
  {
    label: "Loans",
    icon: "bi-bank2",
    href: "#",
    active: false,
  },
];

const userRole = computed(() => authStore.user?.role || "Admin");
const userInitial = computed(() => userRole.value.charAt(0).toUpperCase());

const closeSidebar = () => {
  isOpen.value = false;
};

const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
};

const handleLogout = () => {
  authStore.logout();
  router.replace("/login");
};
</script>

<template>
  <div class="app-shell">
    <button
      v-if="isOpen"
      class="sidebar-backdrop"
      type="button"
      aria-label="Close navigation"
      @click="closeSidebar"
    ></button>

    <aside class="sidebar" :class="{ 'sidebar-open': isOpen }">
      <div class="sidebar-brand">
        <div class="brand-icon">
          <i class="bi bi-bank2"></i>
        </div>
        <div>
          <strong>Vikoba</strong>
          <span>Admin Console</span>
        </div>
      </div>

      <nav class="sidebar-nav" aria-label="Dashboard navigation">
        <a
          v-for="item in navItems"
          :key="item.label"
          class="nav-link"
          :class="{ active: item.active }"
          :href="item.href"
          @click.prevent="closeSidebar"
        >
          <i class="bi" :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </a>
      </nav>

      <div class="sidebar-summary">
        <span>Workspace</span>
        <strong>Vikoba Management</strong>
        <small>Member finance operations</small>
      </div>
    </aside>

    <div class="main-panel">
      <header class="topbar">
        <div class="topbar-left">
          <button
            class="icon-button menu-button"
            type="button"
            aria-label="Open navigation"
            @click="toggleSidebar"
          >
            <i class="bi bi-list"></i>
          </button>

          <div>
            <span class="topbar-kicker">Overview</span>
            <h1>Dashboard</h1>
          </div>
        </div>

        <div class="topbar-actions">
          <div class="user-chip">
            <div class="user-avatar">{{ userInitial }}</div>
            <div>
              <span>{{ userRole }}</span>
              <strong>Signed in</strong>
            </div>
          </div>

          <button class="logout-button" type="button" @click="handleLogout">
            <i class="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main class="content-area">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: grid;
  background:
    radial-gradient(circle at top left, rgba(20, 184, 166, 0.16), transparent 28rem),
    linear-gradient(135deg, #f7faf9 0%, #edf4f7 100%);
  color: #17212b;
}

.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 1040;
  width: min(84vw, 292px);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1rem;
  background:
    linear-gradient(145deg, rgba(8, 29, 38, 0.98), rgba(12, 76, 78, 0.96)),
    url("https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80");
  background-position: center;
  background-size: cover;
  color: #ffffff;
  box-shadow: 24px 0 60px rgba(17, 37, 49, 0.24);
  transform: translateX(-105%);
  transition: transform 0.28s ease;
}

.sidebar::after {
  content: "";
  position: absolute;
  inset: auto 0 0;
  height: 5px;
  background: linear-gradient(90deg, #22c55e, #14b8a6, #f59e0b);
}

.sidebar-open {
  transform: translateX(0);
}

.sidebar-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1030;
  border: 0;
  background: rgba(15, 23, 42, 0.46);
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease both;
}

.sidebar-brand,
.sidebar-nav,
.sidebar-summary {
  position: relative;
  z-index: 1;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.45rem;
}

.brand-icon,
.icon-button,
.user-avatar {
  display: grid;
  place-items: center;
  border-radius: 8px;
}

.brand-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.14);
  color: #9de8d6;
  font-size: 1.35rem;
  backdrop-filter: blur(12px);
}

.sidebar-brand strong {
  display: block;
  font-size: 1.1rem;
  line-height: 1.1;
}

.sidebar-brand span {
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.82rem;
}

.sidebar-nav {
  display: grid;
  gap: 0.45rem;
}

.nav-link {
  min-height: 46px;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.7rem 0.8rem;
  border: 1px solid transparent;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.78);
  font-weight: 750;
  text-decoration: none;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.nav-link i {
  font-size: 1.08rem;
}

.nav-link:hover,
.nav-link.active {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.16);
  transform: translateX(3px);
}

.nav-link.active {
  box-shadow: inset 4px 0 0 #22c55e;
}

.sidebar-summary {
  margin-top: auto;
  padding: 0.95rem;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
}

.sidebar-summary span,
.topbar-kicker,
.user-chip span {
  display: block;
  color: #5d7282;
  font-size: 0.74rem;
  font-weight: 850;
  letter-spacing: 0;
  text-transform: uppercase;
}

.sidebar-summary span {
  color: #9de8d6;
}

.sidebar-summary strong {
  display: block;
  margin-top: 0.2rem;
  font-size: 0.98rem;
}

.sidebar-summary small {
  display: block;
  margin-top: 0.2rem;
  color: rgba(255, 255, 255, 0.68);
}

.main-panel {
  min-width: 0;
  display: grid;
  grid-template-rows: auto 1fr;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 100;
  min-height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem;
  padding: 0.8rem clamp(0.8rem, 3vw, 1.35rem);
  border-bottom: 1px solid rgba(30, 56, 73, 0.08);
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
}

.topbar-left,
.topbar-actions,
.user-chip,
.logout-button {
  display: flex;
  align-items: center;
}

.topbar-left {
  min-width: 0;
  gap: 0.75rem;
}

.topbar-left h1 {
  margin: 0;
  color: #17212b;
  font-size: 1.35rem;
  line-height: 1.1;
  font-weight: 850;
}

.icon-button {
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  border: 1px solid #d8e2e8;
  background: #ffffff;
  color: #0f766e;
  font-size: 1.35rem;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.icon-button:hover {
  transform: translateY(-1px);
  border-color: rgba(20, 184, 166, 0.45);
  box-shadow: 0 12px 28px rgba(25, 48, 65, 0.1);
}

.topbar-actions {
  gap: 0.65rem;
}

.user-chip {
  display: none;
  gap: 0.6rem;
  padding: 0.35rem 0.65rem 0.35rem 0.35rem;
  border: 1px solid rgba(30, 56, 73, 0.08);
  border-radius: 8px;
  background: #ffffff;
}

.user-avatar {
  width: 38px;
  height: 38px;
  background: #ccfbf1;
  color: #0f766e;
  font-weight: 850;
}

.user-chip strong {
  display: block;
  margin-top: 0.05rem;
  color: #17212b;
  font-size: 0.86rem;
}

.logout-button {
  min-height: 42px;
  gap: 0.45rem;
  padding: 0 0.85rem;
  border: 0;
  border-radius: 8px;
  background: #fff1f2;
  color: #be123c;
  font-weight: 850;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.logout-button:hover {
  transform: translateY(-1px);
  background: #ffe4e6;
}

.logout-button span {
  display: none;
}

.content-area {
  min-width: 0;
  padding: clamp(0.75rem, 2vw, 1.25rem);
  animation: riseIn 0.42s ease both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes riseIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 576px) {
  .user-chip,
  .logout-button span {
    display: flex;
  }

  .topbar-left h1 {
    font-size: 1.55rem;
  }
}

@media (min-width: 992px) {
  .app-shell {
    grid-template-columns: 292px minmax(0, 1fr);
  }

  .sidebar {
    position: sticky;
    top: 0;
    width: 292px;
    min-height: 100vh;
    transform: none;
  }

  .sidebar-backdrop,
  .menu-button {
    display: none;
  }

  .topbar {
    min-height: 84px;
    padding-inline: 1.5rem;
  }

  .content-area {
    padding: 1.5rem;
  }
}

@media (max-width: 420px) {
  .topbar {
    align-items: flex-start;
  }

  .topbar-actions {
    margin-top: 0.05rem;
  }

  .logout-button {
    width: 42px;
    padding: 0;
    justify-content: center;
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
