import type { Clothes } from "./clothes";
import type { ClothesTransfer } from "./clothesTransfer";
import type { Device } from "./device";
import type { Employee } from "./employee";
import type { Tool } from "./tool";

export type ObjectToCloseResponse = {
  incomingUnconfirmedItems: {
    tools: Tool[];
    devices: Device[];
    clothes: ClothesTransfer[];
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
    clothes: ClothesTransfer[]; // clothes включены через include
  };
};
