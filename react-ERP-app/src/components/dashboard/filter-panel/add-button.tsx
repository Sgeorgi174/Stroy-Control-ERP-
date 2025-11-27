import { Button } from "@/components/ui/button";
import { useFilterPanelStore } from "@/stores/filter-panel-store";

const tabLabels = {
  tool: "инструмент",
  clothing: "одежду",
  footwear: "обувь",
  object: "объект",
  employee: "сотрудника",
  "my-object": "",
  tablet: "Планшет",
  device: "инвентарь",
  monitoring: "",
  transfers: "",
  admin: "",
  "my-object/id": "",
};

type AddButtonProps = {
  handleAdd: React.MouseEventHandler<HTMLButtonElement>;
};

export function AddButton({ handleAdd }: AddButtonProps) {
  const { activeTab } = useFilterPanelStore();

  return (
    <Button className="w-[195px] font-medium" onClick={handleAdd}>
      {`Добавить ${tabLabels[activeTab]}`}
    </Button>
  );
}
