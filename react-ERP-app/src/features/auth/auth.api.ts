import { api } from "@/lib/api";

// login
export const login = (data: { login: string; password: string }) =>
  api.post("/auth/login", data).then((res) => res.data);

// logout
export const logout = () => api.post("/auth/logout").then((res) => res.data);

// checkAuth
export const checkAuth = () => api.get("/auth/me").then((res) => res.data);
