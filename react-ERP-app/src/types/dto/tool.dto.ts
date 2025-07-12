import type { ToolStatus } from "../tool";

export interface CreateToolDto {
  name: string;
  serialNumber: string;
  objectId: string;
}

export interface UpdateToolDto extends CreateToolDto {
  status?: ToolStatus;
}

export interface UpdateToolStatusDto {
  status: ToolStatus;
  comment?: string;
}

export interface TransferToolDto {
  objectId: string;
}

export interface RejectToolDto {
  rejectionComment: string;
}

export interface ResendToolTransferDto {
  toObjectId: string;
}

export interface WirteOffToolInTransferDto {
  status: ToolStatus;
  comment: string;
}

export interface CancelToolTransferDto {
  rejectionComment: string;
}
