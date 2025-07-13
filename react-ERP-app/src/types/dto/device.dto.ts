import type { DeviceStatus } from "../device";

export interface CreateDeviceDto {
  name: string;
  serialNumber: string;
  objectId: string;
  status?: DeviceStatus;
}

export interface UpdateDeviceDto {
  name: string;
  serialNumber: string;
  objectId: string;
  status?: DeviceStatus;
}

export interface TransferDeviceDto {
  objectId: string;
}

export interface UpdateDeviceStatusDto {
  status: DeviceStatus;
  comment?: string;
}

export interface RejectDeviceDto {
  rejectionComment: string;
}

export interface ResendDeviceTransferDto {
  toObjectId: string;
}

export interface WirteOffDeviceInTransferDto {
  status: DeviceStatus;
  comment: string;
}

export interface CancelDeviceTransferDto {
  rejectionComment: string;
}
