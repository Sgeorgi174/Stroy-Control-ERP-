import { api } from "@/lib/api";
import type { Object } from "@/types/object";
import type { PendingTransfersResponse } from "@/types/transfers";

export const getUserNotifications =
  async (): Promise<PendingTransfersResponse> => {
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

export const getStatusObject = async (): Promise<Object> => {
  const response = await api.get("/users/get-status-object");
  return response.data;
};

export const activateObject = async (objectId: string): Promise<Object> => {
  const response = await api.patch(`/objects/activate/${objectId}`);
  return response.data;
};
