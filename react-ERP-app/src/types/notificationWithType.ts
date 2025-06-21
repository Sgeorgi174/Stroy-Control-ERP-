import type { Tool } from "./tool";
import type { Device } from "./device";
import type { Clothes } from "./clothes";

export type NotificationWithType =
  | (Tool & { itemType: "tool" })
  | (Device & { itemType: "device" })
  | (Clothes & { itemType: "clothes" });
