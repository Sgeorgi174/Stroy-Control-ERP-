import { Button } from "@/components/ui/button";
import { type TabKey } from "./tabs";
import { useStorageTabStore } from "@/stores/storage-tab-store";
import { useClothesSheetStore } from "@/stores/clothes-sheet-store";
import { useToolsSheetStore } from "@/stores/tool-sheet-store";

const tabLabels: Record<TabKey, string> = {
  tool: "инструмент",
  clothing: "одежду",
  footwear: "обувь",
};

export function AddButton() {
  const { activeTab } = useStorageTabStore();
  const openClothesSheet = useClothesSheetStore((s) => s.openSheet);
  const openToolsSheet = useToolsSheetStore((s) => s.openSheet);

  const handleAdd = () => {
    switch (activeTab) {
      case "tool":
        openToolsSheet("add");
        break;
      case "clothing":
      case "footwear":
        openClothesSheet("add");
        break;
    }
  };

  return (
    <Button className="w-[195px] font-medium" onClick={handleAdd}>
      {`Добавить ${tabLabels[activeTab]}`}
    </Button>
  );
}
