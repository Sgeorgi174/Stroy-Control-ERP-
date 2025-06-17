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

export function TabletSheet() {
  const { isOpen, mode, selectedTablet, closeSheet } = useTabletSheetStore();

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
            {mode === "add" && "Добавление нового планшета"}
            {mode === "edit" && `Редактирование: ${selectedTablet?.name}`}
            {mode === "change user" &&
              `Смена владельца у: ${selectedTablet?.name}`}
            {mode === "change status" && `${selectedTablet?.name}`}
            {mode === "details" && `${selectedTablet?.name}`}
          </SheetTitle>
          <SheetDescription className="text-center">
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
