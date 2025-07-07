import { useFilterPanelStore } from "@/stores/filter-panel-store";
import { AddButton } from "../filter-panel/add-button";
import { FilterPanel } from "../filter-panel/filter-panel";
import { SearchInput } from "../filter-panel/search-input";
import { useObjectSheetStore } from "@/stores/objects-sheet-store";
import { ObjectStatusSelectForFilter } from "../filter-panel/filter-object-status-select";
import { useDebouncedState } from "@/hooks/useDebounceState";
import { useEffect } from "react";

export function ObjectsFilter() {
  const { searchQuery, setSearchQuery } = useFilterPanelStore();
  const openObjectsSheet = useObjectSheetStore((s) => s.openSheet);
  const [localSearch, setLocalSearch, debouncedSearch] = useDebouncedState(
    searchQuery,
    700
  );

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  const handleAdd = () => {
    openObjectsSheet("add");
  };

  return (
    <FilterPanel>
      <div className="flex w-full justify-between flex-wrap ">
        <div className="flex items-center gap-2">
          <p className="font-medium">Объекты:</p>
          <ObjectStatusSelectForFilter />
        </div>
        <div className="flex gap-8">
          <AddButton handleAdd={handleAdd} />
          <SearchInput
            searchQuery={localSearch}
            setSearchQuery={setLocalSearch}
          />
        </div>
      </div>
    </FilterPanel>
  );
}
