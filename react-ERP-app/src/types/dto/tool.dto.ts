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
