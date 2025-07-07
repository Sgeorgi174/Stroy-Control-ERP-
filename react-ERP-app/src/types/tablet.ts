import type { Employee } from "./employee";

export type TabletStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "IN_REPAIR"
  | "LOST"
  | "WRITTEN_OFF";

export type Tablet = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  serialNumber: string;
  status: TabletStatus;
  employee: Employee | null;
};
