import { AddButton } from "../filter-panel/add-button";
import { TypeTabs } from "../filter-panel/type-tabs";
import { ObjectSelectForFilter } from "../filter-panel/filter-object-select";
import { SeasonSelectForFilter } from "../filter-panel/filter-season-select";
import { useFilterPanelStore } from "@/stores/filter-panel-store";
import { objects } from "@/constants/objects";
import { FilterPanel } from "../filter-panel/filter-panel";
import { useClothesSheetStore } from "@/stores/clothes-sheet-store";
import { useToolsSheetStore } from "@/stores/tool-sheet-store";
import { SearchInput } from "../filter-panel/search-input";

export function StorageFilters() {
  const { activeTab, searchQuery, setSearchQuery } = useFilterPanelStore();

  const openClothesSheet = useClothesSheetStore((s) => s.openSheet);
  const openToolsSheet = useToolsSheetStore((s) => s.openSheet);

  const handleAdd = () => {
    switch (activeTab) {
      case "tool":
        openToolsSheet("add");
        break;
      case "clothing":
      case "footwear":
        openClothesSheet("add");
        break;
    }
  };

  return (
    <FilterPanel>
      <div className="flex gap-8">
        <TypeTabs />
        <div className="flex items-center gap-2">
          <p className="font-medium">Объект:</p>
          <ObjectSelectForFilter objects={objects} />
        </div>

        {(activeTab === "footwear" || activeTab === "clothing") && (
          <div className="flex items-center gap-2">
            <p className="font-medium">Сезон:</p>
            <SeasonSelectForFilter />
          </div>
        )}
      </div>
      <div className="flex  gap-8">
        <AddButton handleAdd={handleAdd} />
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
    </FilterPanel>
  );
}
