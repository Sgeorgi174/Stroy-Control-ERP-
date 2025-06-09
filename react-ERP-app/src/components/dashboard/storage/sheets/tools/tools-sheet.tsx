import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToolsSheetStore } from "@/stores/tool-sheet-store";
import { ToolsDetails } from "./tools-details";

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
            Подробная информация об инструменте
          </SheetDescription>
        </SheetHeader>

        {/* Тут можно рендерить нужный компонент по mode */}
        {mode === "add" && <div>Форма добавления</div>}
        {mode === "edit" && <div>Форма редактирования</div>}
        {mode === "transfer" && <div>Форма перемещения</div>}
        {mode === "details" && selectedTool && (
          <ToolsDetails tool={selectedTool} />
        )}
      </SheetContent>
    </Sheet>
  );
}
