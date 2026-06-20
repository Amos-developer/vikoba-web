<script setup>
import AuthLayout from "../../layouts/AuthLayout.vue";
</script>

<template>
  <AuthLayout>
    <div
      class="card shadow"
      style="width: 400px"
    >
      <div class="card-body">

        <h3 class="mb-4">
          Login
        </h3>

        <input
          type="email"
          class="form-control mb-3"
          placeholder="Email"
        />

        <input
          type="password"
          class="form-control mb-3"
          placeholder="Password"
        />

        <button
          class="btn btn-primary w-100"
        >
          Login
        </button>

      </div>
    </div>
  </AuthLayout>
</template>