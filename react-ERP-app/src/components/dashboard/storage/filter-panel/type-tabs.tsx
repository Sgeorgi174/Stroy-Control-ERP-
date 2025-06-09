import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TABS, type TabKey } from "./tabs";
import { useStorageTabStore } from "@/stores/storage-tab-store";

export function TypeTabs() {
  const { activeTab, setActiveTab } = useStorageTabStore();
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
