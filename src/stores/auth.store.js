import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";

const idleMinutes = Number(import.meta.env.VITE_SESSION_IDLE_MINUTES || 30);
const idleTimeout = Math.max(1, idleMinutes) * 60 * 1000;
const activityEvents = ["click", "keydown", "mousemove", "scroll", "touchstart"];
let sessionTimer = null;
let listenersBound = false;
let lastActivityWrite = 0;

const tokenExpiry = (token) => {
  try { return Number(jwtDecode(token).exp || 0) * 1000; }
  catch { return 0; }
};

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user") || "null"),
    language: localStorage.getItem("app_language") || "en",
    organization: JSON.parse(localStorage.getItem("organization") || "null"),
    expiresAt: Number(localStorage.getItem("session_expires_at") || 0),
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token && state.expiresAt > Date.now()),
    isAdmin: (state) => state.user?.role === "admin",
  },
  actions: {
    setAuth(token, selectedLanguage, organization) {
      const decoded = jwtDecode(token);
      this.token = token;
      this.expiresAt = Number(decoded.exp) * 1000;
      this.language = selectedLanguage || decoded.language || "en";
      this.user = { userId: decoded.userId, role: decoded.role, language: this.language };
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(this.user));
      localStorage.setItem("app_language", this.language);
      this.organization = organization || this.organization;
      if (this.organization) localStorage.setItem("organization", JSON.stringify(this.organization));
      localStorage.setItem("session_expires_at", String(this.expiresAt));
      localStorage.setItem("session_last_activity", String(Date.now()));
      this.startSessionMonitoring();
    },
    validateSession() {
      if (!this.token) return false;
      const expiresAt = tokenExpiry(this.token);
      const lastActivity = Number(localStorage.getItem("session_last_activity") || Date.now());
      if (!expiresAt || expiresAt <= Date.now() || Date.now() - lastActivity > idleTimeout) {
        this.endSession(expiresAt <= Date.now() ? "expired" : "inactive", expiresAt > Date.now());
        return false;
      }
      this.expiresAt = expiresAt;
      return true;
    },
    recordActivity() {
      if (!this.token || Date.now() - lastActivityWrite < 30000) return;
      lastActivityWrite = Date.now();
      localStorage.setItem("session_last_activity", String(lastActivityWrite));
    },
    startSessionMonitoring() {
      if (!listenersBound) {
        activityEvents.forEach((event) => window.addEventListener(event, () => this.recordActivity(), { passive: true }));
        window.addEventListener("storage", (event) => {
          if (event.key === "token" && !event.newValue && this.token) this.endSession("signed_out", false, true);
        });
        window.addEventListener("session-expired", () => this.endSession("expired", false));
        listenersBound = true;
      }
      if (sessionTimer) clearInterval(sessionTimer);
      sessionTimer = window.setInterval(() => {
        if (!this.validateSession() && window.location.pathname !== "/login") {
          window.location.replace("/login?reason=session_expired");
        }
      }, 30000);
    },
    initializeSession() {
      if (this.validateSession()) this.startSessionMonitoring();
    },
    async endSession(reason = "signed_out", revoke = true, skipRedirect = false) {
      const token = this.token;
      if (revoke && token) {
        try {
          await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/auth/logout`, {
            method: "POST", headers: { Authorization: `Bearer ${token}` }, keepalive: true,
          });
        } catch { /* Local logout still completes when the network is unavailable. */ }
      }
      this.token = null; this.user = null; this.expiresAt = 0;
      localStorage.removeItem("token"); localStorage.removeItem("user");
      localStorage.removeItem("session_expires_at"); localStorage.removeItem("session_last_activity");
      localStorage.removeItem("organization"); this.organization=null;
      if (sessionTimer) { clearInterval(sessionTimer); sessionTimer = null; }
      if (!skipRedirect && window.location.pathname !== "/login") window.location.replace(`/login?reason=${reason}`);
    },
    logout() { return this.endSession("signed_out", true); },
  },
});
