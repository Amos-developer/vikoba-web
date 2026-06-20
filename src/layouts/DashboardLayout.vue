<template>
  <div class="d-flex">

    <!-- Sidebar -->
    <div
      class="bg-dark text-white p-3 sidebar"
      :class="{ 'sidebar-open': isOpen }"
    >
      <h4 class="mb-4">Vikoba Admin</h4>

      <ul class="nav flex-column">

        <li class="nav-item mb-2">
          <a class="nav-link text-white" href="#">
            <i class="bi bi-speedometer2"></i>
            Dashboard
          </a>
        </li>

        <li class="nav-item mb-2">
          <a class="nav-link text-white" href="#">
            <i class="bi bi-people"></i>
            Members
          </a>
        </li>

        <li class="nav-item mb-2">
          <a class="nav-link text-white" href="#">
            <i class="bi bi-cash-stack"></i>
            Savings
          </a>
        </li>

        <li class="nav-item mb-2">
          <a class="nav-link text-white" href="#">
            <i class="bi bi-bank"></i>
            Loans
          </a>
        </li>

      </ul>
    </div>

    <!-- Main Content -->
    <div class="flex-grow-1">

      <!-- Navbar -->
      <nav class="navbar navbar-light bg-light shadow-sm px-3">
        <button class="btn btn-outline-dark d-md-none"
          @click="toggleSidebar"
        >
          <i class="bi bi-list"></i>
        </button>

        <span class="navbar-brand mb-0 h1">
          Dashboard
        </span>

        <button class="btn btn-danger btn-sm">
          Logout
        </button>
      </nav>

      <!-- Page Content -->
      <div class="p-3">
        <slot />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isOpen = ref(false);

const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  min-height: 100vh;
  transition: all 0.3s ease;
}

/* Mobile behavior */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -260px;
    top: 0;
    z-index: 1000;
  }

  .sidebar.sidebar-open {
    left: 0;
  }
}
</style>