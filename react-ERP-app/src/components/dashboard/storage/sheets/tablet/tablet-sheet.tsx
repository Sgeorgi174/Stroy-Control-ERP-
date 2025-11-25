import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TabletDetails } from "./tablet-details";
import { useTabletSheetStore } from "@/stores/tablet-sheet-store";
import { TabletAdd } from "./tablet-add";
import { TabletEdit } from "./tablet-edit";
import { TabletChangeUser } from "./tablet-change-user";
import { TabletChangeStatus } from "./tablet-change-status";
import {
  CheckCircle,
  Clock,
  Hammer,
  Package,
  Tablet,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TabletStatus } from "@/types/tablet";
import { tabletStatusMap } from "@/constants/tabletStatusMap";

export function TabletSheet() {
  const { isOpen, mode, selectedTablet, closeSheet } = useTabletSheetStore();

  const getStatusColor = (status: TabletStatus) => {
    switch (status) {
      case "IN_REPAIR":
        return "bg-yellow-100 text-yellow-800";
      case "INACTIVE":
        return "bg-muted text-muted-foreground";
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "WRITTEN_OFF":
        return "bg-red-100 text-red-800";
      case "LOST":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: TabletStatus) => {
    switch (status) {
      case "IN_REPAIR":
        return <Hammer className="w-4 h-4" />;
      case "INACTIVE":
        return <Clock className="w-4 h-4" />;
      case "ACTIVE":
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
              "Добавление нового планшета"
            ) : (
              <div>
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Tablet className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex flex-col items-start">
                    <p>{selectedTablet?.name}</p>
                    <p className="text-lg text-muted-foreground">
                      Инвентарный: {selectedTablet?.serialNumber}
                    </p>
                  </div>
                </div>
                <div className="w-full flex justify-start mt-5">
                  <Badge
                    className={`${getStatusColor(
                      selectedTablet ? selectedTablet.status : "ACTIVE"
                    )} flex items-center gap-1`}
                  >
                    {selectedTablet && getStatusIcon(selectedTablet.status)}
                    {selectedTablet && tabletStatusMap[selectedTablet.status]}
                  </Badge>
                </div>
              </div>
            )}
          </SheetTitle>
          <SheetDescription className="text-center text-transparent w-0 h-0">
            {mode === "add" && "Заполните данные о новом планшете"}
            {mode === "edit" && `Редактирование выбранного планшета`}
            {mode === "change user" && `Выберите нового владельца из списка`}
            {mode === "details" && `Подробная информация о планшете`}
            {mode === "change status" &&
              `Укажите новый статус и причину смены статуса у планшета`}
          </SheetDescription>
        </SheetHeader>

        {mode === "add" && <TabletAdd />}
        {mode === "edit" && selectedTablet && (
          <TabletEdit tablet={selectedTablet} />
        )}
        {mode === "change user" && selectedTablet && (
          <TabletChangeUser tablet={selectedTablet} />
        )}
        {mode === "details" && selectedTablet && (
          <TabletDetails tablet={selectedTablet} />
        )}
        {mode === "change status" && selectedTablet && (
          <TabletChangeStatus tablet={selectedTablet} />
        )}
      </SheetContent>
    </Sheet>
  );
}
