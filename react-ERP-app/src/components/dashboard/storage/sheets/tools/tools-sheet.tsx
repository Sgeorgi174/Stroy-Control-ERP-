import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToolsSheetStore } from "@/stores/tool-sheet-store";
import { ToolsDetails } from "./tools-details";
import { ToolsAdd } from "./tools-add";
import { ToolsEdit } from "./tools-edit";
import { ToolsTransfer } from "./tools-transfer";

export function ToolsSheet() {
  const { isOpen, mode, selectedTool, closeSheet } = useToolsSheetStore();

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent className="w-[750px] sm:max-w-[1000px]">
        <SheetHeader>
          <SheetTitle className="text-center text-xl font-medium">
            {mode === "add" && "Добавление инструмента"}
            {mode === "edit" && `Редактирование: ${selectedTool?.name}`}
            {mode === "transfer" && `Перемещение: ${selectedTool?.name}`}
            {mode === "details" && `${selectedTool?.name}`}
          </SheetTitle>
          <SheetDescription className="text-center">
            {mode === "add" && "Заполните данные о новом инструменте"}
            {mode === "edit" && `Редактирование выбранного инструмента`}
            {mode === "transfer" &&
              `Заполните данные о перемещении инструмента`}
            {mode === "details" && `Подробная информация об инструменте`}
          </SheetDescription>
        </SheetHeader>

        {mode === "add" && <ToolsAdd />}
        {mode === "edit" && selectedTool && <ToolsEdit tool={selectedTool} />}
        {mode === "transfer" && selectedTool && (
          <ToolsTransfer tool={selectedTool} />
        )}
        {mode === "details" && selectedTool && (
          <ToolsDetails tool={selectedTool} />
        )}
      </SheetContent>
    </Sheet>
  );
}
