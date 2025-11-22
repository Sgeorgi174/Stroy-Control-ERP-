import type { DeviceStatus } from "./device";
import type { Employee } from "./employee";
import type { ToolStatus } from "./tool";

export type ClothesActions =
  | "ADD"
  | "TRANSFER"
  | "CONFIRM"
  | "GIVE_TO_EMPLOYEE"
  | "RETURN_FROM_EMPLOYEE"
  | "WRITTEN_OFF"
  | "CANCEL"
  | "RETURN_TO_SOURCE";

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
  action: ClothesActions;
  toEmployee: Employee;
  emploeyeeId: string;
  writeOffComment: string;
  comment: string;
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
