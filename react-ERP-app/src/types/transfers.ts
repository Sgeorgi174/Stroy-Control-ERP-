import type { Clothes } from "./clothes";
import type { Device } from "./device";
import type { Object } from "./object";
import type { Tool } from "./tool";

export type PendingStatus = "IN_TRANSIT" | "REJECT" | "CONFIRM" | "CANCEL";

export type RejectMode = "RESEND" | "RETURN_TO_SOURCE" | "WRITE_OFF";

export interface PendingClothesTransfer {
  id: string;
  clothesId: string;
  clothes: Clothes;
  quantity: number;
  status: PendingStatus;
  photoUrl?: string;
  rejectionComment?: string;
  fromObjectId: string;
  toObjectId: string;
  fromObject: Object;
  toObject: Object;
  createdAt: string;
  updatedAt: string;
  rejectMode: RejectMode;
}

export interface PendingToolTransfer {
  id: string;
  toolId: string;
  tool: Tool;
  status: PendingStatus;
  photoUrl?: string;
  rejectionComment?: string;
  fromObjectId: string;
  toObjectId: string;
  fromObject: Object;
  toObject: Object;
  createdAt: string;
  updatedAt: string;
  rejectMode: RejectMode;
  quantity: number;
  type: "tool";
}

export interface PendingDeviceTransfer {
  id: string;
  deviceId: string;
  device: Device;
  status: PendingStatus;
  photoUrl?: string;
  rejectionComment?: string;
  fromObjectId: string;
  toObjectId: string;
  fromObject: Object;
  toObject: Object;
  createdAt: string;
  updatedAt: string;
  rejectMode: RejectMode;
}

// --- MAIN RESPONSE ---
export interface PendingTransfersResponse {
  tools: PendingToolTransfer[];
  devices: PendingDeviceTransfer[];
  clothes: PendingClothesTransfer[];
}
