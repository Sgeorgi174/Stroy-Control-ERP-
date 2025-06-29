import { api } from "@/lib/api";
import type { LoginDto, VerifyDto } from "@/types/dto/auth.dto";

export const login = async (data: LoginDto) => {
  return api.post("/auth/login", data);
};

export const verifyOtp = async (data: VerifyDto) => {
  const res = await api.post("/auth/verify", data);
  return res.data; // должен вернуться пользователь
};

export const checkAuth = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const logout = async () => {
  return api.post("/auth/logout");
};
