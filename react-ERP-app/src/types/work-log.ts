import type { Object } from "./object";

export interface WorkLogItem {
  id: string;
  text: string;
  workLogId: string;
}

export interface WorkLogPhoto {
  id: string;
  url: string;
  workLogId: string;
}

export interface WorkLog {
  id: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  objectId: string;
  userId: string;
  object: Object;
  master: {
    firstName: string;
    lastName: string;
  };
  items: WorkLogItem[];
  photos: WorkLogPhoto[];
}
