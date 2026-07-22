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
    confirmPassword?: string; // Permitimos que reciba confirmPassword para que no marque error de tipos en React
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

/**
 * Store global de autenticación. Persiste solo el usuario (no los tokens,
 * que viven en localStorage vía token-storage.ts y se adjuntan por axios).
 */
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
          // 1. Extraemos confirmPassword para NO enviarlo a NestJS (causa error 400 DTO)
          const { confirmPassword, ...cleanPayload } = payload;

          // 2. Sanitizamos el campo teléfono si viene vacío o con espacios
          if (!cleanPayload.phone || cleanPayload.phone.trim() === "") {
            delete cleanPayload.phone;
          } else {
            // Removemos espacios por si el usuario escribió "+51 987 654 321"
            cleanPayload.phone = cleanPayload.phone.replace(/\s+/g, "");
          }

          // 3. Enviamos a la API solo lo que RegisterDto permite
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