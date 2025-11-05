import type { Clothes } from "./clothes";
import type { PendingClothesTransfer } from "./transfers";
import type { Device } from "./device";
import type { Employee } from "./employee";
import type { Tool } from "./tool";

export type ObjectToCloseResponse = {
  incomingUnconfirmedItems: {
    tools: Tool[];
    devices: Device[];
    clothes: PendingClothesTransfer[];
  };
  notEmptyObject: {
    tools: Tool[];
    devices: Device[];
    clothes: Clothes[];
    employees: Employee[];
  };
  outgoingUnconfirmedTransfers: {
    tools: Tool[];
    devices: Device[];
    clothes: PendingClothesTransfer[]; // clothes включены через include
  };
};
