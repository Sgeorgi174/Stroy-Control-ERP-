import type { Object } from "./object";

export type DeviceStatus =
  | "ON_OBJECT"
  | "IN_TRANSIT"
  | "IN_REPAIR"
  | "LOST"
  | "WRITTEN_OFF";

export type Device = {
  id: string;
  name: string;
  serialNumber: string;
  status: DeviceStatus;
  objectId: string;
  createdAt: string;
  updatedAt: string;
  storage: Object;
  originalSerial?: string;
  marketUrl: string | undefined;
};
