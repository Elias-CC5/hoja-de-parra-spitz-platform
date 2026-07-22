import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "./token-storage";

/**
 * Cliente Axios único para toda la app. Envuelve la respuesta del backend
 * (que llega como { success, statusCode, data, timestamp }) y devuelve
 * directamente `data`, así los servicios de cada feature no repiten el unwrap.
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const accessToken = tokenStorage.getAccessToken();
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

function resolveQueue(token: string | null) {
  pendingQueue.forEach((callback) => callback(token));
  pendingQueue = [];
}

api.interceptors.response.use(
  (response) => response.data?.data ?? response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    const isUnauthorized = error.response?.status === 401;
    const isAuthEndpoint = originalRequest?.url?.includes("/auth/");

    if (!isUnauthorized || !originalRequest || originalRequest._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }

    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      tokenStorage.clear();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push((newToken) => {
          if (!newToken) return reject(error);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1"}/auth/refresh`,
        { refreshToken },
      );
      const { accessToken, refreshToken: newRefreshToken } = data.data ?? data;

      tokenStorage.setTokens(accessToken, newRefreshToken);
      resolveQueue(accessToken);

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      tokenStorage.clear();
      resolveQueue(null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
