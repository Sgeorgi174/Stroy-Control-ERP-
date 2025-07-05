import { api } from "@/lib/api";
import type { Device, DeviceStatus } from "@/types/device";
import type {
  CreateDeviceDto,
  RejectDeviceDto,
  TransferDeviceDto,
  UpdateDeviceDto,
  UpdateDeviceStatusDto,
} from "@/types/dto/device.dto";

export const getFilteredDevice = async (params: {
  searchQuery: string;
  objectId?: string | null;
  status?: DeviceStatus | null;
}) => {
  const res = await api.get("/devices/filter", {
    params: {
      searchQuery: params.searchQuery || undefined,
      objectId: params.objectId || undefined,
      status: params.status || undefined,
    },
  });
  return res.data;
};

// Получить инструмент по id
export const getDeviceById = async (id: string): Promise<Device> => {
  const res = await api.get(`/devices/${id}`);
  return res.data;
};

// Создать инструмент
export const createDevice = async (data: CreateDeviceDto): Promise<Device> => {
  const res = await api.post("/devices/create", data);
  return res.data;
};

// Обновить инструмент
export const updateDevice = async (
  id: string,
  data: UpdateDeviceDto
): Promise<Device> => {
  const res = await api.put(`/devices/update/${id}`, data);
  return res.data;
};

// Обновить статус инструмента
export const updateDeviceStatus = async (
  id: string,
  data: UpdateDeviceStatusDto
): Promise<Device> => {
  const res = await api.patch(`/devices/status/${id}`, data);
  return res.data;
};

// Передать инструмент
export const transferDevice = async (
  id: string,
  data: TransferDeviceDto
): Promise<{ transferredDevice: Device }> => {
  const res = await api.patch(`/devices/transfer/${id}`, data);
  return res.data;
};

// Подтвердить передачу
export const confirmDeviceTransfer = async (id: string) => {
  const res = await api.patch(`/devices/confirm/${id}`);
  return res.data;
};

export const rejectDeviceTransfer = async (
  id: string,
  data: RejectDeviceDto
) => {
  const res = await api.patch(`/devices/reject/${id}`, data);
  return res.data;
};

export const requestDevicePhotoByTransferId = async (transferId: string) => {
  const res = await api.post(`/devices/request-photo-transfer/${transferId}`);
  return res.data;
};

// Удалить инструмент
export const deleteDevice = async (id: string): Promise<void> => {
  await api.delete(`/devices/delete/${id}`);
};

export const getDeviceHistory = async (id: string): Promise<void> => {
  const res = await api.get(`/device-history/transfers/${id}`);
  return res.data;
};

export const getDeviceStatusChangesHistory = async (
  id: string
): Promise<void> => {
  const res = await api.get(`/device-history/statuses/${id}`);
  return res.data;
};
