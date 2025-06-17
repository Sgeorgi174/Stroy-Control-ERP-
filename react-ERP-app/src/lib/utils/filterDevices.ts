import type { Device, DeviceStatus } from "@/types/device";

type Params = {
  data: Device[];
  searchQuery: string;
  selectedObjectId: string | null;
  selectedItemStatus: DeviceStatus | null;
};

export function filterDevices({
  data,
  searchQuery,
  selectedObjectId,
  selectedItemStatus,
}: Params): Device[] {
  const lowerSearch = searchQuery.toLowerCase();

  return data
    .filter((item) => {
      if (selectedObjectId) return item.storage.id === selectedObjectId;
      return true;
    })
    .filter((item) => {
      if (selectedItemStatus) return item.status === selectedItemStatus;
      return true;
    })
    .filter((item) => {
      if (!searchQuery) return true;

      const searchFields = [item.name, item.serialNumber].filter(Boolean);

      return searchFields.some((field) =>
        field.toLowerCase().includes(lowerSearch)
      );
    });
}
