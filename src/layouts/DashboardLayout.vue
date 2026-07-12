<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "../stores/auth.store";

const props = defineProps({
  pageTitle: {
    type: String,
    default: "Dashboard",
  },
  pageSubtitle: {
    type: String,
    default: "Overview",
  },
});

const router = useRouter();
const authStore = useAuthStore();
const isOpen = ref(false);
const isCollapsed = ref(false);

const navItems = [
  {
    label: "Dashboard",
    icon: "bi-speedometer2",
    href: "/",
  },
  {
    label: "Members",
    icon: "bi-people",
    href: "/members",
  },
  {
    label: "Savings",
    icon: "bi-wallet2",
    href: "/savings",
  },
  {
    label: "Loans",
    icon: "bi-bank2",
    href: "/loans",
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

const toggleCollapse = () => {
  // only meaningful on wide screens
  isCollapsed.value = !isCollapsed.value;
};

const handleLogout = () => {
  authStore.logout();
  router.replace("/login");
};
</script>

<template>
  <div
    class="app-shell"
    :class="{ 'sidebar-open': isOpen, 'sidebar-collapsed': isCollapsed }"
  >
    <button
      v-if="isOpen"
      class="sidebar-backdrop"
      type="button"
      aria-label="Close navigation"
      @click="closeSidebar"
    ></button>

    <aside
      class="sidebar"
      :class="{ 'sidebar-open': isOpen, 'sidebar-collapsed': isCollapsed }"
    >
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
        <router-link
          v-for="item in navItems"
          :key="item.label"
          class="nav-link"
          :class="{ active: $route.path === item.href }"
          :to="item.href"
          @click="closeSidebar"
        >
          <i class="bi" :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </router-link>
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

          <button
            class="icon-button collapse-button"
            type="button"
            aria-label="Toggle sidebar"
            @click="toggleCollapse"
            title="Toggle sidebar"
          >
            <i
              :class="
                isCollapsed ? 'bi bi-chevron-right' : 'bi bi-chevron-left'
              "
            ></i>
          </button>

          <div>
            <span class="topbar-kicker">{{ props.pageSubtitle }}</span>
            <h1>{{ props.pageTitle }}</h1>
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
  height: 100vh;
  display: block;
  overflow: hidden;
  background:
    radial-gradient(
      circle at top left,
      rgba(20, 184, 166, 0.16),
      transparent 28rem
    ),
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
  gap: 1rem;
  padding: 1rem;
  background: #fbfdff;
  color: #0f172a;
  border-right: 1px solid rgba(15, 23, 42, 0.04);
  box-shadow: 8px 0 30px rgba(15, 23, 42, 0.04);
  transform: translateX(-105%);
  transition:
    transform 0.28s ease,
    width 0.28s ease,
    box-shadow 0.2s ease;
  border-bottom-right-radius: 12px;
}

.sidebar::after {
  display: none;
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

.sidebar.sidebar-collapsed {
  width: 84px !important;
}
.sidebar-collapsed .nav-link span {
  display: none;
}
.sidebar-collapsed .sidebar-brand {
  justify-content: center;
}
.sidebar-collapsed .sidebar-brand strong,
.sidebar-collapsed .sidebar-brand span,
.sidebar-collapsed .sidebar-summary {
  display: none;
}
.sidebar-collapsed .nav-link {
  justify-content: center;
}
.sidebar-collapsed .nav-link i {
  margin: 0 auto;
}
.collapse-button {
  display: none;
  margin-left: 0.5rem;
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
  gap: 0.75rem;
  padding: 0.35rem;
}
.brand-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: #e6f0ff;
  color: #0369a1;
  font-size: 1.15rem;
}
.sidebar-brand strong {
  display: block;
  font-size: 1.05rem;
}
.sidebar-brand span {
  color: var(--muted);
  font-size: 0.82rem;
}

.sidebar-nav {
  display: grid;
  gap: 0.5rem;
  margin-top: 0.6rem;
}
.nav-link {
  min-height: 52px;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.6rem;
  border-radius: 10px;
  text-decoration: none;
  color: var(--muted);
  font-weight: 800;
}
.nav-link i {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: #eef6ff;
  color: #0369a1;
  font-size: 1.05rem;
}
.nav-link span {
  flex: 1;
}
.nav-link:hover {
  background: rgba(3, 105, 161, 0.06);
  color: #0369a1;
}
.nav-link.active {
  background: #e8f2ff;
  color: #0369a1;
  box-shadow: inset 4px 0 0 #2563eb;
}

.sidebar-summary {
  margin-top: auto;
  padding: 1rem;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.06);
}
.sidebar-summary span {
  display: block;
  color: var(--muted);
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
}
.sidebar-summary strong {
  display: block;
  margin-top: 0.3rem;
  font-size: 0.98rem;
}
.sidebar-summary small {
  display: block;
  margin-top: 0.3rem;
  color: var(--muted);
}

.main-panel {
  min-width: 0;
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
  transition: width 0.28s ease;
}

.app-shell.sidebar-collapsed .sidebar {
  width: 84px !important;
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
  padding: 0.9rem clamp(0.9rem, 3vw, 1.35rem);
  border-bottom: 1px solid rgba(30, 56, 73, 0.08);
  background: rgba(255, 255, 255, 0.94);
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
  gap: 0.85rem;
}

.topbar-left h1 {
  margin: 0;
  color: #17212b;
  font-size: 1.4rem;
  line-height: 1.05;
  font-weight: 850;
}

.icon-button {
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  border: 1px solid #d8e2e8;
  background: #ffffff;
  color: #0f766e;
  font-size: 1.3rem;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.icon-button:hover {
  transform: translateY(-1px);
  border-color: rgba(20, 184, 166, 0.45);
  box-shadow: 0 12px 28px rgba(25, 48, 65, 0.1);
}

.topbar-actions {
  gap: 0.75rem;
}

.user-chip {
  display: none;
  gap: 0.7rem;
  padding: 0.5rem 0.85rem;
  border: 1px solid rgba(30, 56, 73, 0.08);
  border-radius: 12px;
  background: #ffffff;
}

.user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: #ccfbf1;
  color: #0f766e;
  font-weight: 850;
  display: grid;
  place-items: center;
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
  padding: 0 0.9rem;
  border: 0;
  border-radius: 10px;
  background: #fff1f2;
  color: #be123c;
  font-weight: 850;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.logout-button:hover {
  transform: translateY(-1px);
  background: #ffe4e6;
  box-shadow: 0 8px 18px rgba(190, 18, 60, 0.12);
}

.logout-button span {
  display: none;
}

.content-area {
  min-width: 0;
  padding: clamp(0.9rem, 2vw, 1.4rem);
  animation: riseIn 0.42s ease both;
  overflow-y: auto;
  max-height: calc(100vh - 76px);
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
    display: grid;
    grid-template-columns: 292px 1fr;
  }

  .app-shell.sidebar-collapsed {
    grid-template-columns: 84px 1fr;
  }

  .sidebar {
    position: sticky;
    top: 0;
    width: 292px;
    min-height: 100vh;
    transform: none;
    border-bottom-right-radius: 0;
  }

  .sidebar.sidebar-collapsed {
    width: 84px !important;
  }

  .main-panel {
    width: 100%;
  }

  .sidebar-backdrop,
  .menu-button {
    display: none;
  }
  .collapse-button {
    display: inline-flex;
  }

  .topbar {
    min-height: 84px;
    padding-inline: 1.5rem;
  }

  .content-area {
    padding: 1.5rem;
    max-height: calc(100vh - 84px);
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
