<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import AuthLayout from "../../layouts/AuthLayout.vue";
import { useAuthStore } from "../../stores/auth.store";
import { login } from "../../services/auth.service";

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref("");

const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = "Please enter your email and password.";
    return;
  }

  try {
    loading.value = true;
    errorMessage.value = "";

    const response = await login({
      email: email.value,
      password: password.value,
    });

    const token = response.data.token;

    authStore.setAuth(token);

    router.push("/");
  } catch (error) {
    console.log("Login failed", error);
    errorMessage.value =
      error.response?.data?.message ||
      "Invalid email or password. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <AuthLayout>
    <main class="login-page">
      <section class="login-shell">
        <div class="brand-panel">
          <div class="brand-mark">
            <i class="bi bi-bank2"></i>
          </div>

          <div class="brand-copy">
            <span>Vikoba Admin</span>
            <h1>Welcome back</h1>
            <p>Sign in to manage members, savings, loans, and account activity with confidence.</p>
          </div>

          <div class="trust-grid">
            <div>
              <i class="bi bi-shield-check"></i>
              <strong>Secure access</strong>
              <span>Protected dashboard sessions</span>
            </div>
            <div>
              <i class="bi bi-graph-up-arrow"></i>
              <strong>Live insights</strong>
              <span>Clear group performance data</span>
            </div>
          </div>
        </div>

        <form class="login-card" @submit.prevent="handleLogin">
          <div class="form-heading">
            <span>Account login</span>
            <h2>Sign in</h2>
          </div>

          <div v-if="errorMessage" class="alert-message">
            <i class="bi bi-exclamation-circle"></i>
            <span>{{ errorMessage }}</span>
          </div>

          <label class="field-group" for="email">
            <span>Email address</span>
            <div class="input-wrap">
              <i class="bi bi-envelope"></i>
              <input
                id="email"
                v-model.trim="email"
                type="email"
                autocomplete="email"
                placeholder="name@example.com"
              />
            </div>
          </label>

          <label class="field-group" for="password">
            <span>Password</span>
            <div class="input-wrap">
              <i class="bi bi-lock"></i>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Enter your password"
              />
              <button
                class="icon-button"
                type="button"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                @click="showPassword = !showPassword"
              >
                <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
              </button>
            </div>
          </label>

          <button class="submit-button" type="submit" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm"></span>
            <i v-else class="bi bi-box-arrow-in-right"></i>
            {{ loading ? "Signing in..." : "Sign in" }}
          </button>
        </form>
      </section>
    </main>
  </AuthLayout>
</template>

<style scoped>
.login-page {
  width: 100%;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: clamp(1rem, 4vw, 2rem);
  background:
    radial-gradient(circle at top left, rgba(20, 184, 166, 0.2), transparent 26rem),
    linear-gradient(135deg, #f7faf9 0%, #edf4f7 100%);
  color: #17212b;
}

.login-shell {
  width: min(100%, 1040px);
  display: grid;
  gap: 1rem;
  animation: riseIn 0.55s ease both;
}

.brand-panel,
.login-card {
  border: 1px solid rgba(30, 56, 73, 0.08);
  border-radius: 8px;
  box-shadow: 0 24px 70px rgba(17, 37, 49, 0.12);
}

.brand-panel {
  position: relative;
  overflow: hidden;
  min-height: 320px;
  display: grid;
  align-content: end;
  gap: 1.3rem;
  padding: clamp(1.25rem, 4vw, 2rem);
  background:
    linear-gradient(135deg, rgba(8, 29, 38, 0.94), rgba(13, 91, 86, 0.9)),
    url("https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=80");
  background-position: center;
  background-size: cover;
  color: #ffffff;
}

.brand-panel::after {
  content: "";
  position: absolute;
  inset: auto 0 0;
  height: 5px;
  background: linear-gradient(90deg, #22c55e, #14b8a6, #f59e0b);
}

.brand-mark,
.brand-copy,
.trust-grid {
  position: relative;
  z-index: 1;
}

.brand-mark {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.14);
  color: #9de8d6;
  font-size: 1.7rem;
  backdrop-filter: blur(12px);
}

.brand-copy span,
.form-heading span,
.field-group > span {
  display: block;
  color: #5d7282;
  font-size: 0.76rem;
  font-weight: 850;
  letter-spacing: 0;
  text-transform: uppercase;
}

.brand-copy span {
  color: #9de8d6;
}

.brand-copy h1 {
  margin: 0.35rem 0 0;
  font-size: 2.15rem;
  line-height: 0.98;
  font-weight: 850;
  letter-spacing: 0;
}

.brand-copy p {
  max-width: 560px;
  margin: 0.9rem 0 0;
  color: rgba(255, 255, 255, 0.76);
}

.trust-grid {
  display: grid;
  gap: 0.75rem;
}

.trust-grid > div {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.15rem 0.7rem;
  padding: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
}

.trust-grid i {
  grid-row: span 2;
  color: #9de8d6;
  font-size: 1.3rem;
}

.trust-grid strong {
  font-size: 0.94rem;
}

.trust-grid span {
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.84rem;
}

.login-card {
  display: grid;
  gap: 1rem;
  padding: clamp(1.1rem, 5vw, 2rem);
  background: rgba(255, 255, 255, 0.92);
}

.form-heading h2 {
  margin: 0.25rem 0 0;
  color: #17212b;
  font-size: 1.65rem;
  font-weight: 850;
}

.alert-message {
  display: flex;
  gap: 0.6rem;
  align-items: flex-start;
  padding: 0.85rem;
  border-radius: 8px;
  background: #fff1f2;
  color: #be123c;
  font-weight: 700;
  animation: shakeIn 0.25s ease both;
}

.field-group {
  display: grid;
  gap: 0.45rem;
}

.input-wrap {
  min-height: 54px;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0 0.85rem;
  border: 1px solid #d8e2e8;
  border-radius: 8px;
  background: #ffffff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.input-wrap:focus-within {
  border-color: #14b8a6;
  box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.12);
  transform: translateY(-1px);
}

.input-wrap > i {
  color: #0f766e;
  font-size: 1.05rem;
}

.input-wrap input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #17212b;
  font: inherit;
}

.input-wrap input::placeholder {
  color: #94a3b8;
}

.icon-button {
  width: 38px;
  height: 38px;
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  border: 0;
  border-radius: 8px;
  background: #f1f5f9;
  color: #52616f;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.icon-button:hover {
  background: #ccfbf1;
  color: #0f766e;
}

.submit-button {
  min-height: 54px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  margin-top: 0.25rem;
  border: 0;
  border-radius: 8px;
  background: linear-gradient(135deg, #0f766e, #0e9488);
  color: #ffffff;
  font-weight: 850;
  box-shadow: 0 16px 34px rgba(15, 118, 110, 0.24);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px rgba(15, 118, 110, 0.3);
  filter: brightness(1.03);
}

.submit-button:disabled {
  cursor: not-allowed;
  opacity: 0.78;
}

@keyframes riseIn {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shakeIn {
  0% {
    transform: translateX(-4px);
  }

  100% {
    transform: translateX(0);
  }
}

@media (min-width: 640px) {
  .trust-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .brand-copy h1 {
    font-size: 3rem;
  }

  .form-heading h2 {
    font-size: 2rem;
  }
}

@media (min-width: 992px) {
  .login-shell {
    grid-template-columns: minmax(0, 1.12fr) minmax(360px, 0.88fr);
    align-items: stretch;
  }

  .brand-panel {
    min-height: 640px;
  }

  .login-card {
    align-content: center;
  }

  .brand-copy h1 {
    font-size: 4.5rem;
  }

  .form-heading h2 {
    font-size: 2.4rem;
  }
}

@media (max-width: 420px) {
  .login-page {
    padding: 0.8rem;
  }

  .brand-panel {
    min-height: 300px;
  }

  .trust-grid > div {
    padding: 0.8rem;
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
