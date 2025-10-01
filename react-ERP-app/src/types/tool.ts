import type { Object } from "./object";
import type { PendingToolTransfer } from "./transfers";

export type ToolStatus =
  | "ON_OBJECT"
  | "IN_TRANSIT"
  | "IN_REPAIR"
  | "LOST"
  | "WRITTEN_OFF";

export type Tool = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  status: ToolStatus;
  serialNumber: string;
  objectId: string;
  storage: Object;
  inTransit: PendingToolTransfer[];
  isBag: boolean;
  bagItems: { id: string; name: string; quantity: number }[];
};
