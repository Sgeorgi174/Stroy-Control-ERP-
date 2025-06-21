import { api } from "@/lib/api";

export const getUserNotifications = async () => {
  const response = await api.get("/users/notification");
  return response.data;
};
