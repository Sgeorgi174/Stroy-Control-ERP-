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
  storage: {
    foreman: {
      firstName: string;
      lastName: string;
      phone: string;
    } | null;
    name: string;
  };
};
