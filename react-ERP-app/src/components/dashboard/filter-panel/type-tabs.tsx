import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type TabKey } from "../../../types/tabs";
import { useFilterPanelStore } from "@/stores/filter-panel-store";

const TABS: {
  key: TabKey;
  label: string;
}[] = [
  {
    key: "tool",
    label: "Инструменты",
  },
  {
    key: "device",
    label: "Орг. Техника",
  },
  {
    key: "tablet",
    label: "Планшеты",
  },
  {
    key: "clothing",
    label: "Одежда",
  },
  {
    key: "footwear",
    label: "Обувь",
  },
];

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
