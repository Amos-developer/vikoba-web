<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.store";

defineProps({
  pageTitle: { type: String, default: "Dashboard" },
  pageSubtitle: { type: String, default: "Overview" },
});

const router = useRouter();
const authStore = useAuthStore();
const isOpen = ref(false);
const isCollapsed = ref(false);
const navItems = [
  { label: "Dashboard", icon: "bi-grid", href: "/", roles: [] },
  { label: "Members", icon: "bi-people", href: "/members", roles: ["chairperson", "secretary"] },
  { label: "Meetings", icon: "bi-calendar3", href: "/meetings", roles: [] },
  { label: "Financial Cycles", icon: "bi-calendar2-range", href: "/cycles", roles: ["chairperson", "treasurer", "secretary"] },
  { label: "Savings", icon: "bi-wallet2", href: "/savings", roles: ["treasurer", "secretary"] },
  { label: "Shares / Hisa", icon: "bi-stack", href: "/shares", roles: ["chairperson", "treasurer", "secretary"] },
  { label: "Social Fund", icon: "bi-heart-pulse", href: "/social-fund", roles: ["chairperson", "treasurer", "secretary"] },
  { label: "Loans", icon: "bi-bank", href: "/loans", roles: ["chairperson", "treasurer"] },
  { label: "Repayments", icon: "bi-arrow-repeat", href: "/repayments", roles: ["treasurer"] },
  { label: "Penalties", icon: "bi-exclamation-diamond", href: "/penalties", roles: ["chairperson", "secretary"] },
  { label: "Income", icon: "bi-cash-coin", href: "/income", roles: ["chairperson", "treasurer", "secretary"] },
  { label: "Expenses", icon: "bi-receipt", href: "/expenses", roles: ["chairperson", "treasurer", "secretary"] },
  { label: "Transactions", icon: "bi-journal-text", href: "/transactions", roles: ["chairperson", "treasurer"] },
  { label: "Share-out", icon: "bi-pie-chart", href: "/share-out", roles: ["chairperson", "treasurer", "secretary"] },
  { label: "Reports", icon: "bi-bar-chart", href: "/reports", roles: ["chairperson", "treasurer", "secretary"] },
  { label: "Users & Approvals", icon: "bi-shield-check", href: "/access", roles: ["chairperson", "treasurer", "secretary"] },
  { label: "Audit Logs", icon: "bi-activity", href: "/audit-logs", roles: ["chairperson", "secretary"] },
];
const userRole = computed(() => authStore.user?.role || "Admin");
const visibleNavItems = computed(() => navItems.filter(
  (item) => userRole.value.toLowerCase() === "admin"
    || !item.roles.length
    || item.roles.includes(userRole.value.toLowerCase()),
));
const userInitial = computed(() => userRole.value.charAt(0).toUpperCase());
const closeSidebar = () => (isOpen.value = false);
const handleLogout = async () => { await authStore.logout(); };
</script>

<template>
  <div class="viewport-frame">
    <div class="app-shell" :class="{ collapsed: isCollapsed }">
      <button v-if="isOpen" class="backdrop" aria-label="Close menu" @click="closeSidebar"></button>
      <aside class="sidebar" :class="{ open: isOpen }">
        <div class="brand">
          <span class="brand-mark">V</span>
          <div><strong>Vikoba</strong><small>Management Platform</small></div>
        </div>
        <label class="sidebar-search"><i class="bi bi-search"></i><input type="search" placeholder="Search..." /></label>
        <span class="nav-label">Workspace</span>
        <nav aria-label="Main navigation">
          <router-link v-for="item in visibleNavItems" :key="item.href" :to="item.href" :class="{ active: $route.path === item.href }" @click="closeSidebar">
            <i class="bi" :class="item.icon"></i><span>{{ item.label }}</span>
          </router-link>
        </nav>
        <div class="sidebar-spacer"></div>
        <div class="profile">
          <span class="profile-avatar">{{ userInitial }}</span>
          <div><strong>{{ userRole }}</strong><small>Administrator</small></div>
        </div>
        <button class="logout-button" type="button" aria-label="Log out" @click="handleLogout">
          <i class="bi bi-box-arrow-right"></i><span>Logout</span>
        </button>
      </aside>

      <section class="main-panel">
        <header class="topbar">
          <div class="heading-group">
            <button class="mobile-menu" type="button" aria-label="Open menu" @click="isOpen = true"><i class="bi bi-list"></i></button>
            <button class="collapse-menu" type="button" aria-label="Collapse sidebar" @click="isCollapsed = !isCollapsed"><i class="bi" :class="isCollapsed ? 'bi-layout-sidebar-inset' : 'bi-layout-sidebar'"></i></button>
            <div><span>{{ pageSubtitle }}</span><h1>{{ pageTitle }}</h1></div>
          </div>
          <div class="top-actions">
            <span class="refresh-note">Auto-refreshing</span>
            <button type="button" @click="$router.go(0)"><i class="bi bi-arrow-repeat"></i><span>Refresh</span></button>
          </div>
        </header>
        <main><slot /></main>
      </section>
    </div>
  </div>
</template>

<style scoped>
.viewport-frame{min-height:100vh;padding:0;background:#7659e8}.app-shell{min-height:100vh;background:#f7f7f9;color:#242328}.sidebar{position:fixed;inset:0 auto 0 0;z-index:30;width:min(82vw,240px);display:flex;flex-direction:column;padding:1rem;background:#fbfbfc;border-right:1px solid #e9e9ed;transform:translateX(-102%);transition:transform .25s ease,width .25s ease}.sidebar.open{transform:translateX(0)}.backdrop{position:fixed;inset:0;z-index:25;border:0;background:rgba(24,24,27,.42)}.brand{display:flex;align-items:center;gap:.65rem;padding:.1rem .2rem 1rem}.brand-mark{width:2rem;height:2rem;display:grid;place-items:center;border-radius:7px;background:linear-gradient(135deg,#8c72f6,#7055df);color:#fff;font-size:.75rem;font-weight:800}.brand strong,.brand small,.profile strong,.profile small{display:block}.brand strong{font-size:.85rem}.brand small,.profile small{color:#92919a;font-size:.62rem}.sidebar-search{display:flex;align-items:center;gap:.45rem;padding:.52rem .6rem;border:1px solid #e8e7ec;border-radius:8px;background:#fff;color:#9a99a2}.sidebar-search input{width:100%;border:0;outline:0;background:transparent;font-size:.72rem}.nav-label{margin:1rem .35rem .4rem;color:#a1a0a8;font-size:.58rem;text-transform:uppercase}nav{display:grid;gap:.22rem}nav a{display:flex;align-items:center;gap:.7rem;padding:.62rem .7rem;border-radius:7px;color:#65646d;text-decoration:none;font-size:.75rem;font-weight:500}nav a i{width:1rem;text-align:center}nav a:hover,nav a.active{background:#fff;color:#201f24;box-shadow:0 2px 10px rgba(24,24,27,.05)}nav a.active{font-weight:700}nav a.active i{color:#7659e8}.sidebar-spacer{flex:1}.profile{display:grid;grid-template-columns:auto 1fr;align-items:center;gap:.55rem;padding-top:.8rem;border-top:1px solid #ededf0}.profile-avatar{width:2rem;height:2rem;display:grid;place-items:center;border-radius:50%;background:#e9e4ff;color:#6e54da;font-weight:700}.profile strong{font-size:.74rem}.logout-button{display:flex;align-items:center;justify-content:center;gap:.55rem;width:100%;margin-top:.7rem;padding:.6rem .7rem;border:1px solid #f0d9dc;border-radius:8px;background:#fff8f8;color:#b4404c;font-size:.73rem;font-weight:600}.logout-button:hover{border-color:#e8bfc4;background:#fff0f1}.main-panel{min-width:0;min-height:100vh}.topbar{min-height:70px;display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:.7rem 1rem;border-bottom:1px solid #e8e8ec;background:rgba(255,255,255,.96)}.heading-group,.top-actions{display:flex;align-items:center;gap:.6rem}.heading-group>div>span{display:block;color:#96959d;font-size:.65rem}.heading-group h1{margin:.12rem 0 0;font-size:1.08rem;line-height:1.2}.mobile-menu,.collapse-menu,.top-actions button{height:2.2rem;border:1px solid #e5e4ea;border-radius:8px;background:#fff;color:#5d5c64}.mobile-menu,.collapse-menu{width:2.2rem}.collapse-menu{display:none}.top-actions button{display:inline-flex;align-items:center;gap:.4rem;padding:0 .7rem;font-size:.7rem}.top-actions .primary-action{border-color:#7659e8;background:#7659e8;color:#fff}.refresh-note{display:none;color:#9a99a2;font-size:.6rem}main{padding:.75rem}.collapsed .sidebar nav a span,.collapsed .brand div,.collapsed .sidebar-search,.collapsed .nav-label,.collapsed .profile div,.collapsed .logout-button span{display:none}.collapsed .sidebar nav a{justify-content:center}.collapsed .profile{grid-template-columns:1fr;justify-items:center}.collapsed .logout-button{padding-inline:0}
@media(min-width:600px){.viewport-frame{padding:4px;border-radius:18px}.app-shell{min-height:calc(100vh - 8px);border-radius:15px;overflow:hidden}.top-actions button span{display:inline}.refresh-note{display:inline}main{padding:1rem}}
@media(max-width:440px){.top-actions button span,.refresh-note{display:none}.top-actions button{width:2.2rem;padding:0;justify-content:center}}
@media(min-width:960px){.app-shell{display:grid;grid-template-columns:240px minmax(0,1fr);transition:grid-template-columns .25s ease}.app-shell.collapsed{grid-template-columns:72px minmax(0,1fr)}.sidebar{position:sticky;top:0;width:240px;height:calc(100vh - 8px);transform:none}.collapsed .sidebar{width:72px}.mobile-menu,.backdrop{display:none}.collapse-menu{display:inline-grid;place-items:center}main{padding:1rem}.topbar{padding-inline:1.25rem}}
@media(prefers-reduced-motion:reduce){*{transition:none!important}}
/* Full-screen application shell: no decorative frame around the UI. */
.viewport-frame {
  padding: 0;
  background: #f6f7f9;
}

.app-shell {
  min-height: 100vh;
  border-radius: 0;
  background: #f6f7f9;
  overflow: visible;
}

.sidebar {
  background: #ffffff;
}

@media (min-width: 600px) {
  .viewport-frame {
    padding: 0;
    border-radius: 0;
  }

  .app-shell {
    min-height: 100vh;
    border-radius: 0;
  }
}

@media (min-width: 960px) {
  .sidebar {
    height: 100vh;
  }

  main {
    padding: 1.5rem;
  }
}

/* Independent application rail: only the menu scrolls; account actions stay visible. */
.sidebar {
  height: 100dvh;
  overflow: hidden;
}

.sidebar nav {
  flex: 1 1 auto;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding-right: .2rem;
  scrollbar-color: #d9d5e8 transparent;
  scrollbar-width: thin;
}

.sidebar nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar nav::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: #d9d5e8;
}

.sidebar-spacer {
  display: none;
}

.profile,
.logout-button {
  flex: 0 0 auto;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
}

@media (min-width: 960px) {
  .app-shell,
  .app-shell.collapsed {
    display: block;
  }

  .sidebar,
  .collapsed .sidebar {
    position: fixed;
    inset: 0 auto 0 0;
  }

  .main-panel {
    margin-left: 240px;
    transition: margin-left .25s ease;
  }

  .collapsed .main-panel {
    margin-left: 72px;
  }
}
</style>
