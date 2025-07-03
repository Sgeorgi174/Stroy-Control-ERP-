import { api } from "@/lib/api";
import type { PendingTransfersResponse } from "@/types/transfers";

export const getUserNotifications = async () => {
  const response = await api.get("/users/notification");
  return response.data;
};

export const getFreeForemen = async () => {
  const response = await api.get("/users/foremen");
  return response.data;
};

export const getAllTransfers = async (): Promise<PendingTransfersResponse> => {
  const response = await api.get("/users/transfers");
  return response.data;
};
