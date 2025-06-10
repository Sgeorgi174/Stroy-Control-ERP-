import { FilterPanel } from "@/components/dashboard/storage/filter-panel/filter-panel";
import { ClothesSheet } from "@/components/dashboard/storage/sheets/clothes/clothes-sheet";
import { ToolsSheet } from "@/components/dashboard/storage/sheets/tools/tools-sheet";
import { ClothesTable } from "@/components/dashboard/storage/tables/clothes-table";
import { clothes_and_footwear } from "@/constants/clothes_and_footwear";
import { tools } from "@/constants/tools";
import { ToolsTable } from "@/components/dashboard/storage/tables/tools-table";
import { filterClothes } from "@/lib/utils/filterClothes";
import { filterTools } from "@/lib/utils/filterTools";
import { useFilterPanelStore } from "@/stores/filter-panel-store";

export function Storage() {
  const { activeTab, searchQuery, selectedObjectId, selectedSeason } =
    useFilterPanelStore();

  const filteredClothes = filterClothes({
    data: clothes_and_footwear,
    activeTab,
    searchQuery,
    selectedObjectId,
    selectedSeason,
  });

  const filteredTools = filterTools({
    data: tools,
    searchQuery,
    selectedObjectId,
  });

  return (
    <div>
      <FilterPanel />
      {activeTab === "tool" ? (
        <ToolsTable tools={filteredTools} />
      ) : (
        <ClothesTable clothes={filteredClothes} />
      )}
      <ToolsSheet />
      <ClothesSheet />
    </div>
  );
}
