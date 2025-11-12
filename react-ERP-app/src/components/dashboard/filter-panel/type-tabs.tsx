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
    label: "Быт. Инвентарь",
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
  const { activeTab, setActiveTab, resetFilters } = useFilterPanelStore();

  return (
    <Tabs
      value={activeTab}
      onValueChange={(val) => {
        if (val !== activeTab) {
          setActiveTab(val as TabKey);
          resetFilters(); // 👈 красивее, чем вручную затирать всё
        }
      }}
    >
      <TabsList>
        {TABS.map((tab) => (
          <TabsTrigger key={tab.key} value={tab.key}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
