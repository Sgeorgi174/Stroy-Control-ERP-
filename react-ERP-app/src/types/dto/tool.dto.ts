import type { ToolStatus } from "../tool";

export interface CreateToolDto {
  name: string;
  serialNumber?: string;
  objectId: string;
  isBulk?: boolean;
  quantity?: number;
}

export interface UpdateToolDto extends CreateToolDto {
  status?: ToolStatus;
}

export interface AddToolBagItemDto {
  name: string;
  quantity: number;
}

export interface RemoveToolBagItemDto {
  quantity: number;
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

export interface AddToolCommentDto {
  comment: string;
}

export interface AddQuantityTool {
  quantity: number;
}

export interface WriteOffQuantityTool {
  quantity: number;
  comment: string;
}
