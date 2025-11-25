import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DeviceDetails } from "./device-details";
import { DeviceAdd } from "./device-add";
import { DeviceEdit } from "./device-edit";
import { DeviceTransfer } from "./device-transfer";
import { DeviceChangeStatus } from "./device-change-status";
import { useDeviceSheetStore } from "@/stores/device-sheet-store";
import type { DeviceStatus } from "@/types/device";
import { CheckCircle, Hammer, Package, Printer, XCircle } from "lucide-react";
import { Clock } from "@/components/ui/clock";
import { Badge } from "@/components/ui/badge";
import { deviceStatusMap } from "@/constants/deviceStatusMap";

export function DeviceSheet() {
  const { isOpen, mode, selectedDevice, closeSheet } = useDeviceSheetStore();

  const getStatusColor = (status: DeviceStatus) => {
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

  const getStatusIcon = (status: DeviceStatus) => {
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
              "Добавление нового устройства"
            ) : (
              <div>
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Printer className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex flex-col items-start">
                    <p>{selectedDevice?.name}</p>
                    <p className="text-lg text-muted-foreground">
                      Инвентарный: {selectedDevice?.serialNumber}
                    </p>
                  </div>
                </div>
                <div className="w-full flex justify-start mt-5">
                  <Badge
                    className={`${getStatusColor(
                      selectedDevice ? selectedDevice.status : "ON_OBJECT"
                    )} flex items-center gap-1`}
                  >
                    {selectedDevice && getStatusIcon(selectedDevice.status)}
                    {selectedDevice && deviceStatusMap[selectedDevice.status]}
                  </Badge>
                </div>
              </div>
            )}
          </SheetTitle>
          <SheetDescription className="text-center  text-transparent w-0 h-0">
            {mode === "add" && "Заполните данные о новой еденице технки"}
            {mode === "edit" && `Редактирование выбранной орг. техники`}
            {mode === "transfer" && `Заполните данные о перемещении техники`}
            {mode === "details" && `Подробная информация о технике`}
            {mode === "change status" &&
              `Укажите новый статус и причину смены статуса у техники`}
          </SheetDescription>
        </SheetHeader>

        {mode === "add" && <DeviceAdd />}
        {mode === "edit" && selectedDevice && (
          <DeviceEdit device={selectedDevice} />
        )}
        {mode === "transfer" && selectedDevice && (
          <DeviceTransfer device={selectedDevice} />
        )}
        {mode === "details" && selectedDevice && (
          <DeviceDetails device={selectedDevice} />
        )}
        {mode === "change status" && selectedDevice && (
          <DeviceChangeStatus device={selectedDevice} />
        )}
      </SheetContent>
    </Sheet>
  );
}
