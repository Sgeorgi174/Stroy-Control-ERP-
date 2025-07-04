import type { Clothes } from "./clothes";
import type { Device } from "./device";
import type { Object } from "./object";
import type { Tool } from "./tool";

export type PendingStatus = "IN_TRANSIT" | "REJECT" | "CONFIRM";

export interface PendingClothesTransfer {
  id: string;
  clothesId: string;
  clothes: Clothes;
  quantity: number;
  status: PendingStatus;
  fromObjectId: string;
  toObjectId: string;
  fromObject: Object;
  toObject: Object;
  createdAt: string;
}

export interface PendingToolTransfer {
  id: string;
  toolId: string;
  tool: Tool;
  status: PendingStatus;
  fromObjectId: string;
  toObjectId: string;
  fromObject: Object;
  toObject: Object;
  createdAt: string;
}

export interface PendingDeviceTransfer {
  id: string;
  deviceId: string;
  device: Device;
  status: PendingStatus;
  fromObjectId: string;
  toObjectId: string;
  fromObject: Object;
  toObject: Object;
  createdAt: string;
}

// --- MAIN RESPONSE ---
export interface PendingTransfersResponse {
  tools: PendingToolTransfer[];
  devices: PendingDeviceTransfer[];
  clothes: PendingClothesTransfer[];
}
