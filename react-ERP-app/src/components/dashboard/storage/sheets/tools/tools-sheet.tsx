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
import { ToolsChangeStatus } from "./tools-change-status";
import {
  CheckCircle,
  Clock,
  Hammer,
  Package,
  Wrench,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toolStatusMap } from "@/constants/toolStatusMap";
import type { ToolStatus } from "@/types/tool";
import { ToolBagEdit } from "./tool-bag-edit";
import { ToolAddQuantity } from "./tool-add-quantity";
import { ToolWriteOffQuantity } from "./tool-write-off-quantity";

export function ToolsSheet() {
  const { isOpen, mode, selectedTool, closeSheet } = useToolsSheetStore();

  const getStatusColor = (status: ToolStatus) => {
    switch (status) {
      case "IN_REPAIR":
        return "bg-yellow-100 text-yellow-800";
      case "IN_TRANSIT":
        return "bg-blue-100 text-blue-800";
      case "ON_OBJECT":
        return "bg-green-100 text-green-800";
      case "WRITTEN_OFF":
        return "bg-red-100 text-red-800";
      case "LOST":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: ToolStatus) => {
    switch (status) {
      case "IN_REPAIR":
        return <Hammer className="w-4 h-4" />;
      case "IN_TRANSIT":
        return <Clock className="w-4 h-4" />;
      case "ON_OBJECT":
        return <CheckCircle className="w-4 h-4" />;
      case "WRITTEN_OFF":
        return <XCircle className="w-4 h-4" />;
      case "LOST":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent
        className="w-[700px] sm:max-w-[1000px] overflow-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle className="text-center text-xl font-medium">
            {mode === "add" ? (
              "Добавление инструмента"
            ) : (
              <div>
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex flex-col items-start">
                    <p>{selectedTool?.name}</p>
                    {selectedTool?.isBulk ? (
                      <p className="text-lg text-muted-foreground">
                        Количество: {selectedTool?.quantity}
                      </p>
                    ) : (
                      <p className="text-lg text-muted-foreground">
                        Серийный: {selectedTool?.serialNumber}
                      </p>
                    )}
                  </div>
                </div>
                <div className="w-full flex justify-start mt-5">
                  <Badge
                    className={`${getStatusColor(
                      selectedTool ? selectedTool.status : "ON_OBJECT"
                    )} flex items-center gap-1`}
                  >
                    {selectedTool && getStatusIcon(selectedTool.status)}
                    {selectedTool && toolStatusMap[selectedTool.status]}
                  </Badge>
                </div>
              </div>
            )}
          </SheetTitle>
          <SheetDescription className="text-center text-transparent w-0 h-0">
            {mode === "add" && "Заполните данные о новом инструменте"}
            {mode === "edit" && `Редактирование выбранного инструмента`}
            {mode === "edit bag" && `Редактирование выбранной сумки`}
            {mode === "transfer" &&
              `Заполните данные о перемещении инструмента`}
            {mode === "details" && `Подробная информация об инструменте`}
            {mode === "change status" &&
              `Укажите новый статус и причину смены статуса у инструмента`}
          </SheetDescription>
        </SheetHeader>

        {mode === "add" && <ToolsAdd />}
        {mode === "edit" && selectedTool && <ToolsEdit tool={selectedTool} />}
        {mode === "add qunatity" && selectedTool && (
          <ToolAddQuantity tool={selectedTool} />
        )}

        {mode === "write off" && selectedTool && (
          <ToolWriteOffQuantity tool={selectedTool} />
        )}
        {mode === "edit bag" && selectedTool && (
          <ToolBagEdit tool={selectedTool} />
        )}
        {mode === "transfer" && selectedTool && (
          <ToolsTransfer tool={selectedTool} />
        )}
        {mode === "details" && selectedTool && (
          <ToolsDetails tool={selectedTool} />
        )}
        {mode === "change status" && selectedTool && (
          <ToolsChangeStatus tool={selectedTool} />
        )}
      </SheetContent>
    </Sheet>
  );
}
