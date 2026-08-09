import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/lib/axios";
import { tokenStorage } from "@/lib/token-storage";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword?: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const data = await api.post<never, AuthResponse>("/auth/login", { email, password });
          tokenStorage.setTokens(data.accessToken, data.refreshToken);
          set({ user: data.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (payload) => {
        set({ isLoading: true });
        try {
          const { confirmPassword: _confirmPassword, ...cleanPayload } = payload;

          if (!cleanPayload.phone || cleanPayload.phone.trim() === "") {
            delete cleanPayload.phone;
          } else {
            cleanPayload.phone = cleanPayload.phone.replace(/\s+/g, "");
          }

          const data = await api.post<never, AuthResponse>("/auth/register", cleanPayload);
          tokenStorage.setTokens(data.accessToken, data.refreshToken);
          set({ user: data.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await api.post("/auth/logout");
        } catch {
          // Si falla la llamada al backend, igual limpiamos la sesión local
        } finally {
          tokenStorage.clear();
          set({ user: null, isAuthenticated: false });
        }
      },

      fetchProfile: async () => {
        if (!tokenStorage.getAccessToken()) return;
        try {
          const user = await api.get<never, User>("/users/me");
          set({ user, isAuthenticated: true });
        } catch {
          tokenStorage.clear();
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "hdps-auth",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
);