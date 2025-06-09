import { AddButton } from "./add-button";
import { TypeTabs } from "./type-tabs";
import { Input } from "@/components/ui/input";
import { ObjectSelect } from "./object-select";
import { SeasonSelect } from "./season-select";
import { useStorageTabStore } from "@/stores/storage-tab-store";

export function FilterPanel() {
  const { activeTab, searchQuery, setSearchQuery } = useStorageTabStore();

  return (
    <div className="flex items-center justify-between gap-6 mt-6">
      <div className="flex gap-8">
        <TypeTabs />
        <ObjectSelect />
        {(activeTab === "footwear" || activeTab === "clothing") && (
          <SeasonSelect />
        )}
      </div>
      <div className="flex gap-8">
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
