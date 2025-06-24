import type { TabletStatus } from "./tablet";

export type TabletHistoryRecord = {
  comment: string;
  createdAt: string;
  fromEmployeeId: string | null;
  fromStatus: TabletStatus;
  id: string;
  tabletId: string;
  toEmployeeId: string | null;
  toStatus: TabletStatus;
  userId: string;
  changedBy: { firstName: string; lastName: string };
  fromEmployee: { firstName: string; lastName: string };
  toEmployee: { firstName: string; lastName: string };
};
