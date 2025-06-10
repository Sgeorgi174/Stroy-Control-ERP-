import type { Tool } from "@/types/tool";

type FilterParams = {
  data: Tool[];
  searchQuery: string;
  selectedObjectId: string | null;
};

export function filterTools({
  data,
  searchQuery,
  selectedObjectId,
}: FilterParams): Tool[] {
  const lowerSearch = searchQuery.toLowerCase();

  return data
    .filter((item) => {
      if (selectedObjectId) return item.objectId === selectedObjectId;
      return true;
    })
    .filter((item) => {
      if (!searchQuery) return true;

      const searchFields = [item.name, item.serialNumber, item.status].filter(
        Boolean
      );

      return searchFields.some((field) =>
        field.toString().toLowerCase().includes(lowerSearch)
      );
    });
}
