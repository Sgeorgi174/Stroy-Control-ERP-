import type { TabKey } from "@/components/dashboard/storage/filter-panel/tabs";
import type { Clothes } from "@/types/clothes";

type FilterParams = {
  data: Clothes[];
  activeTab: TabKey;
  searchQuery: string;
  selectedObjectId: string | null;
  selectedSeason: "SUMMER" | "WINTER" | null;
};

export function filterClothes({
  data,
  activeTab,
  searchQuery,
  selectedObjectId,
  selectedSeason,
}: FilterParams): Clothes[] {
  const lowerSearch = searchQuery.toLowerCase();

  return data
    .filter((item) =>
      activeTab === "clothing"
        ? item.type === "CLOTHING"
        : item.type === "FOOTWEAR"
    )
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
    .filter((item) => !selectedObjectId || item.objectId === selectedObjectId)
    .filter(
      (item) =>
        activeTab === "tool" ||
        !selectedSeason ||
        item.season === selectedSeason
    );
}
