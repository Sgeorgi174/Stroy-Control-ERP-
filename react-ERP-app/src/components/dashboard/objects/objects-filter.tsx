import { useFilterPanelStore } from "@/stores/filter-panel-store";
import { AddButton } from "../filter-panel/add-button";
import { FilterPanel } from "../filter-panel/filter-panel";
import { SearchInput } from "../filter-panel/search-input";
import { useObjectSheetStore } from "@/stores/objects-sheet-store";

export function ObjectsFilter() {
  const { searchQuery, setSearchQuery } = useFilterPanelStore();
  const openObjectsSheet = useObjectSheetStore((s) => s.openSheet);

  const handleAdd = () => {
    openObjectsSheet("add");
  };

  return (
    <FilterPanel>
      <div className="flex w-full justify-end">
        <div className="flex gap-8">
          <AddButton handleAdd={handleAdd} />
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>
    </FilterPanel>
  );
}
