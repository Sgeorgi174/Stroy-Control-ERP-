import type { DeviceStatus } from "./device";
import type { ToolStatus } from "./tool";

type Actions =
  | "ADD"
  | "TRANSFER"
  | "CONFIRM"
  | "GIVE_TO_EMPLOYEE"
  | "WRITTEN_OFF";

export type TransferRecord = {
  createdAt: string;
  fromObject: { name: string };
  fromObjectId: string;
  id: string;
  movedBy: { firstName: string; lastName: string };
  toObject: { name: string };
  toObjectId: string;
  toolId: string;
  updatedAt: string;
  userId: string;
  quantity: number;
  action: Actions;
};

export type StatusChangesRecord = {
  changedBy: { firstName: string; lastName: string };
  comment: string;
  createdAt: string;
  fromStatus: ToolStatus | DeviceStatus;
  id: string;
  toStatus: ToolStatus | DeviceStatus;
  toolId: string;
  userId: string;
};
