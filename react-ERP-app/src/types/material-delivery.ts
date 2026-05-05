import type { Object } from "./object";

export interface MaterialPhoto {
  id: string;
  url: string;
  deliveryId: string;
}

export interface MaterialDelivery {
  id: string;
  date: string;
  createdAt: string;
  objectId: string;
  masterId: string;
  object: Object;
  master: {
    firstName: string;
    lastName: string;
  };
  photos: MaterialPhoto[];
}
