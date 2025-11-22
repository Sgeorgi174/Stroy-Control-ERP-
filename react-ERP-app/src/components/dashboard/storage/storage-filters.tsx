import { AddButton } from "../filter-panel/add-button";
import { TypeTabs } from "../filter-panel/type-tabs";
import { ObjectSelectForFilter } from "../filter-panel/filter-object-select";
import { SeasonSelectForFilter } from "../filter-panel/filter-season-select";
import { useFilterPanelStore } from "@/stores/filter-panel-store";
import { FilterPanel } from "../filter-panel/filter-panel";
import { useClothesSheetStore } from "@/stores/clothes-sheet-store";
import { useToolsSheetStore } from "@/stores/tool-sheet-store";
import { SearchInput } from "../filter-panel/search-input";
import { TabletStatusSelectForFilter } from "../filter-panel/filter-tablet-status-select";
import { ItemStatusSelectForFilter } from "../filter-panel/filter-items-select";
import { useDeviceSheetStore } from "@/stores/device-sheet-store";
import { useTabletSheetStore } from "@/stores/tablet-sheet-store";
import { useObjects } from "@/hooks/object/useObject";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useDebouncedState } from "@/hooks/useDebounceState";
import { ClothesSettingsDropdown } from "./сlothes-settings-dropdown";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type StorageFiltersProps = {
  isBulk: boolean;
  setIsBulk: Dispatch<SetStateAction<boolean>>;
};

export function StorageFilters({ isBulk, setIsBulk }: StorageFiltersProps) {
  const { activeTab, searchQuery, setSearchQuery } = useFilterPanelStore();
  const [localSearch, setLocalSearch, debouncedSearch] = useDebouncedState(
    searchQuery,
    700
  );

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  const openClothesSheet = useClothesSheetStore((s) => s.openSheet);
  const openToolsSheet = useToolsSheetStore((s) => s.openSheet);
  const openDevicesSheet = useDeviceSheetStore((s) => s.openSheet);
  const openTabletsSheet = useTabletSheetStore((s) => s.openSheet);

  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });

  const handleAdd = () => {
    switch (activeTab) {
      case "tool":
        openToolsSheet("add");
        break;
      case "clothing":
      case "footwear":
        openClothesSheet("create");
        break;
      case "device":
        openDevicesSheet("add");
        break;
      case "tablet":
        openTabletsSheet("add");
        break;
    }
  };

  return (
    <FilterPanel>
      <div className="flex justify-between w-full flex-wrap gap-4">
        <div className="flex gap-4">
          <TypeTabs />

          {activeTab === "tool" && (
            <Tabs
              value={isBulk ? "true" : "false"}
              onValueChange={(val) => setIsBulk(val === "true")}
              className="w-[400px]"
            >
              <TabsList>
                <TabsTrigger value="false">Одиночные</TabsTrigger>
                <TabsTrigger value="true">Групповые</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          {(activeTab === "clothing" || activeTab === "footwear") && (
            <ClothesSettingsDropdown />
          )}
        </div>
        {activeTab !== "tablet" && (
          <div className="flex items-center gap-2">
            <p className="font-medium">Объект:</p>
            <ObjectSelectForFilter objects={objects} />
          </div>
        )}

        {(activeTab === "footwear" || activeTab === "clothing") && (
          <div className="flex items-center gap-2">
            <p className="font-medium">Сезон:</p>
            <SeasonSelectForFilter />
          </div>
        )}

        {activeTab === "tablet" && (
          <div className="flex items-center gap-2">
            <p className="font-medium">Статус:</p>
            <TabletStatusSelectForFilter />
          </div>
        )}

        {(activeTab === "device" || (activeTab === "tool" && !isBulk)) && (
          <div className="flex items-center gap-2">
            <p className="font-medium">Статус:</p>
            <ItemStatusSelectForFilter />
          </div>
        )}
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
