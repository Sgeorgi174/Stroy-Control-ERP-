import { useFilterPanelStore } from "@/stores/filter-panel-store";
import { AddButton } from "../filter-panel/add-button";
import { FilterPanel } from "../filter-panel/filter-panel";
import { SearchInput } from "../filter-panel/search-input";
import { ObjectSelectForFilter } from "../filter-panel/filter-object-select";
import { objects } from "@/constants/objects";

export function EmployeesFilter() {
  const { searchQuery, setSearchQuery } = useFilterPanelStore();

  const handleAdd = () => {
    console.log("click");
  };

  return (
    <FilterPanel>
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-2">
          <p className="font-medium">Объект:</p>
          <ObjectSelectForFilter objects={objects} />
        </div>
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
