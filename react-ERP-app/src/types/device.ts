import type { Object } from "./object";

export type DeviceStatus =
  | "ON_OBJECT"
  | "IN_TRANSIT"
  | "IN_REPAIR"
  | "LOST"
  | "WRITTEN_OFF";

export type Device = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  status: DeviceStatus;
  serialNumber: string;
  storage: Object;
};
