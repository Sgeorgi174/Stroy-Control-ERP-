// types/object-document.ts
export type ObjectDocType = "IMPORT" | "EXPORT" | "BRING_IN" | "TAKE_OUT";

export interface ObjectDocument {
  id: string;
  createdAt: string;
  name: string;
  type: ObjectDocType;
  comment: string | null;
  fileUrl: string | null;
  fileName: string | null;
  objectId: string;
  masterId: string;
  master: {
    firstName: string;
    lastName: string;
  };
  tools: { id: string; name: string; serialNumber: string | null }[];
  devices: { id: string; name: string; serialNumber: string | null }[];
  _count?: {
    tools: number;
    devices: number;
  };
}
