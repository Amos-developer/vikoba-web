<template>
  <AuthLayout>
    <div class="card shadow" style="width: 400px">
      <div class="card-body">

        <h3 class="mb-4">Login</h3>

        <input
          v-model="email"
          type="email"
          class="form-control mb-3"
          placeholder="Email"
        />

        <input
          v-model="password"
          type="password"
          class="form-control mb-3"
          placeholder="Password"
        />

        <button
          class="btn btn-primary w-100"
          @click="handleLogin"
        >
          Login
        </button>

      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import AuthLayout from "../../layouts/AuthLayout.vue";
import { useAuthStore } from "../../stores/auth.store";
import { login } from "../../services/auth.service";

const email = ref("");
const password = ref("");

const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  try {
    const response = await login({
      email: email.value,
      password: password.value,
    });

    const token = response.data.token;

    authStore.setAuth(token);

    router.push("/");
  } catch (error) {
    console.log("Login failed", error);
    alert("Invalid credentials");
  }
};
</script>