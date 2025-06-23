import type { DeviceStatus } from "../device";
import type { Positions } from "../employee";

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  fatherName?: string;
  phoneNumber: string;
  clothingSize: number;
  footwearSize: number;
  position: Positions;
  objectId?: string;
}

export interface UpdateEmployeeDto {
  name: string;
  serialNumber: string;
  objectId: string;
  status?: DeviceStatus;
}

export interface TransferEmployeeDto {
  objectId: string;
}
