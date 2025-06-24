import { api } from "@/lib/api";

export const getUserNotifications = async () => {
  const response = await api.get("/users/notification");
  return response.data;
};

export const getFreeForemen = async () => {
  const response = await api.get("/users/foremen");
  return response.data;
};
