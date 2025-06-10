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
    .filter((item) => {
      if (activeTab === "clothing") return item.type === "CLOTHING";
      if (activeTab === "footwear") return item.type === "FOOTWEAR";
      return true;
    })
    .filter((item) => {
      if (selectedObjectId) return item.objectId === selectedObjectId;
      return true;
    })
    .filter((item) => {
      if (activeTab !== "tool" && selectedSeason) {
        return item.season === selectedSeason;
      }
      return true;
    })
    .filter((item) => {
      if (!searchQuery) return true;

      const searchFields = [item.name, item.size].filter(Boolean);

      return searchFields.some((field) =>
        field.toString().toLowerCase().includes(lowerSearch)
      );
    });
}
