import type { Tool } from "./tool";
import type { Device } from "./device";
import type { ClothesTransfer } from "./transfers";

export type NotificationWithType =
  | (Tool & { itemType: "tool" })
  | (Device & { itemType: "device" })
  | (ClothesTransfer & { itemType: "clothes" });
