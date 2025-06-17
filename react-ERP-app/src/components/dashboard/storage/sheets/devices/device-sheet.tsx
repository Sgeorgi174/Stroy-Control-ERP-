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

export function DeviceSheet() {
  const { isOpen, mode, selectedDevice, closeSheet } = useDeviceSheetStore();

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent
        className="w-[750px] sm:max-w-[1000px]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle className="text-center text-xl font-medium">
            {mode === "add" && "Добавление орг. техники"}
            {mode === "edit" && `Редактирование: ${selectedDevice?.name}`}
            {mode === "transfer" && `Перемещение: ${selectedDevice?.name}`}
            {mode === "change status" && ` ${selectedDevice?.name}`}
            {mode === "details" && `${selectedDevice?.name}`}
          </SheetTitle>
          <SheetDescription className="text-center">
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
