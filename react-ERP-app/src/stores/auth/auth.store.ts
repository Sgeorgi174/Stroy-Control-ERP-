import { login, logout, checkAuth } from "@/features/auth/auth.api";
import { create } from "zustand";

type AuthStore = {
  user: {
    id: string;
    login: string;
    role: string;
    firstName: string;
    lastName: string;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initAuth: () => Promise<void>;
  login: (data: { login: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  initAuth: async () => {
    try {
      const user = await checkAuth();
      set({ user, isAuthenticated: true });
    } catch {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (data) => {
    try {
      set({ isLoading: true });
      const user = await login(data);
      set({ user, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await logout();
    set({ user: null, isAuthenticated: false });
  },
}));
