import axios from "axios";

const baseURL =
  (typeof import.meta !== "undefined" &&
    (import.meta as any).env?.VITE_API_BASE_URL) ||
  "http://localhost:8000";

export const api = axios.create({
  baseURL,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

// Token management
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export const getAccessToken = () => accessToken;

// Initialize token from localStorage on app start
if (typeof window !== "undefined") {
  const stored = localStorage.getItem("access_token");
  if (stored) {
    setAccessToken(stored);
  }
}

api.interceptors.response.use(
  (r) => r,
  (error) => {
    // Normalize error shape for callers.
    const message =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.message ||
      "Request failed";
    return Promise.reject(
      Object.assign(new Error(message), { original: error }),
    );
  },
);

export { baseURL as API_BASE_URL };
