import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TABS, type TabKey } from "./tabs";
import { useFilterPanelStore } from "@/stores/filter-panel-store";

export function TypeTabs() {
  const { activeTab, setActiveTab } = useFilterPanelStore();
  return (
    <Tabs
      value={activeTab}
      onValueChange={(val) => setActiveTab(val as TabKey)} // <- ключевой момент
    >
      <TabsList>
        {TABS.map((tab) => (
          <TabsTrigger className="w-[108px]" key={tab.key} value={tab.key}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
