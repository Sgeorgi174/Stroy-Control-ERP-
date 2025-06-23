import type { TabletStatus } from "../tablet";

export interface CreateTabletDto {
  name: string;
  serialNumber: string;
  employeeId: string;
}

export interface UpdateTabletDto extends CreateTabletDto {
  status?: TabletStatus;
}

export interface UpdateTabletStatusDto {
  status: TabletStatus;
  comment?: string;
}

export interface TransferTabletDto {
  employeeId: string;
}
