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
    .filter((item) =>
      Object.values(item)
        .flatMap((val) => {
          if (typeof val === "string" || typeof val === "number")
            return val.toString();
          if (typeof val === "object" && val !== null)
            return Object.values(val).map(String);
          return [];
        })
        .some((value) => value.toLowerCase().includes(lowerSearch))
    )
    .filter((item) => !selectedObjectId || item.objectId === selectedObjectId);
}
