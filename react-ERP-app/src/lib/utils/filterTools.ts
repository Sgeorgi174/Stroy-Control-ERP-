import type { Tool, ToolStatus } from "@/types/tool";

type FilterParams = {
  data: Tool[];
  searchQuery: string;
  selectedObjectId: string | null;
  selectedItemStatus: ToolStatus | null;
};

export function filterTools({
  data,
  searchQuery,
  selectedObjectId,
  selectedItemStatus,
}: FilterParams): Tool[] {
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
        field.toString().toLowerCase().includes(lowerSearch)
      );
    });
}
