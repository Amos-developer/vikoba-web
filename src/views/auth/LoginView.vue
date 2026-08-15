<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import AuthLayout from "../../layouts/AuthLayout.vue";
import { login } from "../../services/auth.service";
import { useAuthStore } from "../../stores/auth.store";

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const sessionMessage = computed(() => ({
  expired: "Your session expired. Sign in again to continue.",
  inactive: "You were signed out after a period of inactivity.",
  session_expired: "Your session ended. Sign in again to continue.",
  signed_out: "You have been signed out securely.",
}[route.query.reason] || ""));

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = "Enter your email address and password.";
    return;
  }
  try {
    loading.value = true;
    errorMessage.value = "";
    const response = await login({ email: email.value, password: password.value });
    authStore.setAuth(response.data.token);
    await router.replace("/");
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "The email or password is incorrect.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <AuthLayout>
    <main class="auth-page">
      <section class="auth-shell">
        <aside class="welcome-panel">
          <div class="brand"><span>V</span><div><strong>Vikoba</strong><small>Group Finance Platform</small></div></div>
          <div class="welcome-copy">
            <span class="eyebrow">Built for accountable groups</span>
            <h1>One clear view of your group finances.</h1>
            <p>Manage savings, loans, repayments, meetings, and approvals from a secure shared workspace.</p>
          </div>
          <div class="feature-list">
            <div><i class="bi bi-shield-check"></i><span><strong>Controlled access</strong><small>Role-based permissions and approvals</small></span></div>
            <div><i class="bi bi-journal-check"></i><span><strong>Complete audit trail</strong><small>Every financial movement stays traceable</small></span></div>
          </div>
          <p class="welcome-footer"><i class="bi bi-lock-fill"></i> Secure group administration</p>
        </aside>

        <section class="form-panel">
          <div class="mobile-brand"><span>V</span><div><strong>Vikoba</strong><small>Group Finance Platform</small></div></div>
          <div class="form-heading"><span>Welcome back</span><h2>Sign in to your account</h2><p>Enter your account details to continue.</p></div>

          <form @submit.prevent="handleLogin">
            <div v-if="sessionMessage" class="session-message" role="status"><i class="bi bi-info-circle"></i><span>{{ sessionMessage }}</span></div>
            <div v-if="errorMessage" class="alert-message" role="alert"><i class="bi bi-exclamation-circle"></i><span>{{ errorMessage }}</span></div>

            <label class="field-group" for="email">
              <span>Email address</span>
              <div class="input-wrap"><i class="bi bi-envelope"></i><input id="email" v-model.trim="email" type="email" autocomplete="email" inputmode="email" placeholder="you@example.com" required autofocus /></div>
            </label>

            <label class="field-group" for="password">
              <span>Password</span>
              <div class="input-wrap"><i class="bi bi-lock"></i><input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" placeholder="Enter your password" required /><button type="button" :aria-label="showPassword ? 'Hide password' : 'Show password'" @click="showPassword=!showPassword"><i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i></button></div>
            </label>

            <button class="submit-button" type="submit" :disabled="loading"><span v-if="loading" class="spinner-border spinner-border-sm"></span><span>{{ loading ? "Signing in..." : "Sign in" }}</span><i v-if="!loading" class="bi bi-arrow-right"></i></button>
          </form>
          <p class="support-note">Having trouble signing in? Contact your group administrator.</p>
        </section>
      </section>
    </main>
  </AuthLayout>
</template>

<style scoped>
.auth-page{min-height:100dvh;display:grid;place-items:center;padding:1rem;background:#f5f5f8;color:#211f27}.auth-shell{width:min(100%,1080px);display:grid;overflow:hidden;border:1px solid #e8e6ee;border-radius:18px;background:#fff;box-shadow:0 24px 70px rgba(35,28,58,.12)}.welcome-panel{display:none}.form-panel{padding:1.4rem}.mobile-brand,.brand{display:flex;align-items:center;gap:.7rem}.mobile-brand>span,.brand>span{width:2.4rem;height:2.4rem;display:grid;place-items:center;border-radius:9px;background:linear-gradient(135deg,#8b70f2,#6849d6);color:#fff;font-size:.85rem;font-weight:800;box-shadow:0 8px 18px rgba(105,73,215,.24)}.mobile-brand strong,.mobile-brand small,.brand strong,.brand small{display:block}.mobile-brand strong,.brand strong{font-size:.9rem}.mobile-brand small,.brand small{margin-top:.05rem;color:#8d8996;font-size:.65rem}.form-heading{margin:2.6rem 0 1.7rem}.form-heading>span,.eyebrow{color:#7457df;font-size:.7rem;font-weight:750;letter-spacing:.08em;text-transform:uppercase}.form-heading h2{margin:.4rem 0 .55rem;font-size:clamp(1.6rem,7vw,2rem);letter-spacing:-.035em}.form-heading p{margin:0;color:#85818c;font-size:.86rem}.form-panel form{display:grid;gap:1.05rem}.field-group{display:grid;gap:.45rem}.field-group>span{font-size:.74rem;font-weight:650}.input-wrap{min-height:50px;display:flex;align-items:center;gap:.65rem;padding:0 .8rem;border:1px solid #dedbe5;border-radius:10px;background:#fff;transition:.2s ease}.input-wrap:focus-within{border-color:#795ee2;box-shadow:0 0 0 4px rgba(121,94,226,.11)}.input-wrap>i{color:#8c8795}.input-wrap input{width:100%;min-width:0;border:0;outline:0;background:transparent;color:#242128;font-size:.85rem}.input-wrap input::placeholder{color:#aaa6b1}.input-wrap button{width:2rem;height:2rem;display:grid;place-items:center;flex:none;border:0;border-radius:7px;background:transparent;color:#85818c}.input-wrap button:hover{background:#f2effd;color:#6e51d7}.alert-message{display:flex;align-items:flex-start;gap:.55rem;padding:.75rem .8rem;border:1px solid #f5ccd1;border-radius:9px;background:#fff5f6;color:#b53d4a;font-size:.75rem}.submit-button{min-height:50px;display:flex;align-items:center;justify-content:center;gap:.6rem;margin-top:.2rem;padding:0 1rem;border:0;border-radius:10px;background:#7255de;color:#fff;font-size:.82rem;font-weight:700;box-shadow:0 10px 24px rgba(103,75,208,.23);transition:.2s ease}.submit-button i{transition:transform .2s ease}.submit-button:hover:not(:disabled){background:#6548d2;transform:translateY(-1px);box-shadow:0 14px 30px rgba(103,75,208,.28)}.submit-button:hover:not(:disabled) i{transform:translateX(3px)}.submit-button:disabled{cursor:not-allowed;opacity:.7}.support-note{margin:1.5rem 0 0;color:#96919d;text-align:center;font-size:.68rem}
@media(min-width:560px){.auth-page{padding:2rem}.form-panel{padding:2.5rem}.auth-shell{max-width:520px}.form-heading{margin-top:3.2rem}}
@media(min-width:900px){.auth-shell{max-width:1080px;grid-template-columns:minmax(0,1.08fr) minmax(380px,.92fr);min-height:650px}.welcome-panel{position:relative;display:flex;flex-direction:column;padding:2.4rem;overflow:hidden;background:linear-gradient(145deg,#292039,#4d368d 60%,#7052d7);color:#fff}.welcome-panel::before,.welcome-panel::after{content:"";position:absolute;border-radius:50%;border:1px solid rgba(255,255,255,.1)}.welcome-panel::before{width:380px;height:380px;right:-180px;top:-130px}.welcome-panel::after{width:290px;height:290px;left:-150px;bottom:-120px}.brand,.welcome-copy,.feature-list,.welcome-footer{position:relative;z-index:1}.brand small{color:rgba(255,255,255,.56)}.welcome-copy{margin:auto 0 2.2rem}.welcome-copy .eyebrow{color:#c8baf9}.welcome-copy h1{max-width:520px;margin:.65rem 0 1rem;font-size:clamp(2.7rem,4vw,4rem);line-height:1.02;letter-spacing:-.055em}.welcome-copy p{max-width:480px;margin:0;color:rgba(255,255,255,.7);font-size:.95rem;line-height:1.7}.feature-list{display:grid;grid-template-columns:repeat(2,1fr);gap:.7rem}.feature-list>div{display:flex;gap:.7rem;padding:.85rem;border:1px solid rgba(255,255,255,.12);border-radius:11px;background:rgba(255,255,255,.07)}.feature-list i{color:#cdbfff}.feature-list span,.feature-list strong,.feature-list small{display:block}.feature-list strong{font-size:.74rem}.feature-list small{margin-top:.2rem;color:rgba(255,255,255,.55);font-size:.62rem;line-height:1.4}.welcome-footer{display:flex;align-items:center;gap:.4rem;margin:1.2rem 0 0;color:rgba(255,255,255,.48);font-size:.62rem}.form-panel{display:flex;flex-direction:column;justify-content:center;padding:clamp(2.5rem,5vw,4.4rem)}.mobile-brand{display:none}.form-heading{margin:0 0 2rem}.support-note{margin-top:2rem}}
@media(prefers-reduced-motion:reduce){*{transition:none!important}}
</style>
<style scoped>.session-message{display:flex;align-items:flex-start;gap:.55rem;padding:.75rem .8rem;border:1px solid #dcd5f5;border-radius:9px;background:#f6f3ff;color:#6851bd;font-size:.75rem}</style>
