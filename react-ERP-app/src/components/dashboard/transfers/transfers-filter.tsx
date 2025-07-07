import { useFilterPanelStore } from "@/stores/filter-panel-store";
import { FilterPanel } from "../filter-panel/filter-panel";
import { SearchInput } from "../filter-panel/search-input";
import { useDebouncedState } from "@/hooks/useDebounceState";
import { useEffect } from "react";
import { DatePicker } from "../filter-panel/date-picker";
import { TransferStatusForFilter } from "../filter-panel/filter-transfer-status";
import { FromObjectToObjectForFilter } from "../filter-panel/filter-fromObject-toObject";
import { useObjects } from "@/hooks/object/useObject";

export function TransfersFilter() {
  const { searchQuery, setSearchQuery } = useFilterPanelStore();
  const [localSearch, setLocalSearch, debouncedSearch] = useDebouncedState(
    searchQuery,
    700
  );

  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  return (
    <FilterPanel>
      <div className="flex w-full justify-between items-center flex-wrap ">
        <div className="flex items-center gap-2">
          <DatePicker />
        </div>
        <TransferStatusForFilter />
        <FromObjectToObjectForFilter objects={objects} />
        {/* <div className="flex gap-8">
          <SearchInput
            searchQuery={localSearch}
            setSearchQuery={setLocalSearch}
          />
        </div> */}
      </div>
    </FilterPanel>
  );
}
