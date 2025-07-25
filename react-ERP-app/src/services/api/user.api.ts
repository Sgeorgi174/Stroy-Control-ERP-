import { api } from "@/lib/api";
import type { Object } from "@/types/object";
import type {
  PendingClothesTransfer,
  PendingDeviceTransfer,
  PendingToolTransfer,
  PendingTransfersResponse,
} from "@/types/transfers";

export const getUserNotifications =
  async (): Promise<PendingTransfersResponse> => {
    const response = await api.get("/users/notification");
    return response.data;
  };

export const getReturns = async (): Promise<PendingTransfersResponse> => {
  const response = await api.get("/users/notification-return");
  return response.data;
};

export const getFreeForemen = async () => {
  const response = await api.get("/users/foremen");
  return response.data;
};

export const getTransfers = async (params: {
  status?: string | null;
  fromObjectId?: string | null;
  toObjectId?: string | null;
  updatedAt?: string;
}): Promise<PendingTransfersResponse> => {
  const response = await api.get("/users/transfers", { params });
  return response.data;
};

export const getStatusObject = async (): Promise<Object> => {
  const response = await api.get("/users/get-status-object");
  return response.data;
};

export const getToolTransferPhoto = async (
  transferId: string
): Promise<PendingToolTransfer> => {
  const response = await api.get(`/users/transfer-tool-photo/${transferId}`);
  return response.data;
};

export const getDeviceTransferPhoto = async (
  transferId: string
): Promise<PendingDeviceTransfer> => {
  const response = await api.get(`/users/transfer-device-photo/${transferId}`);
  return response.data;
};

export const getClothesTransferPhoto = async (
  transferId: string
): Promise<PendingClothesTransfer> => {
  const response = await api.get(`/users/transfer-clothes-photo/${transferId}`);
  return response.data;
};

export const activateObject = async (objectId: string): Promise<Object> => {
  const response = await api.patch(`/objects/activate/${objectId}`);
  return response.data;
};
