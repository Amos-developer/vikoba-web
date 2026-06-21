import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === "admin",
  },

  actions: {
    setAuth(token) {
      this.token = token;

      // decode JWT
      const decoded = jwtDecode(token);

      this.user = {
        userId: decoded.userId,
        role: decoded.role,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(this.user));
    },

    logout() {
      this.token = null;
      this.user = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});
