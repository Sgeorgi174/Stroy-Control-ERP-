import { AddButton } from "./add-button";
import { TypeTabs } from "./type-tabs";
import { Input } from "@/components/ui/input";
import { ObjectSelectForFilter } from "./filter-object-select";
import { SeasonSelectForFilter } from "./filter-season-select";
import { useFilterPanelStore } from "@/stores/filter-panel-store";
import { objects } from "@/constants/objects";

export function FilterPanel() {
  const { activeTab, searchQuery, setSearchQuery } = useFilterPanelStore();

  return (
    <div className="flex items-center flex-wrap justify-between gap-6 mt-6">
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
        <AddButton />
        <Input
          type="text"
          placeholder="Поиск"
          className="w-[350px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
}
