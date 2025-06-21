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
  storage: {
    foreman: {
      firstName: string;
      lastName: string;
      phone: string;
    } | null;
    name: string;
  };
};
