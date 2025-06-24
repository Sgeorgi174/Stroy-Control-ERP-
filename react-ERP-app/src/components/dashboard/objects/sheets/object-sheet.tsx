import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useObjectSheetStore } from "@/stores/objects-sheet-store";
import { ObjectAdd } from "./object-add";
import { ObjectEdit } from "./object-edit";
import { ObjectDetails } from "./object-details";
import { ObjectAddEmployee } from "./object-add-employee";
import { CloseObject } from "./close-object/close-object";
import { ChangeForeman } from "./change-foreman";

export function ObjectsSheet() {
  const { isOpen, mode, selectedObject, closeSheet } = useObjectSheetStore();

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent
        className="w-[850px] sm:max-w-[1000px]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle className="text-center text-xl font-medium">
            {mode === "add" ? "Новый объект" : selectedObject?.name}
          </SheetTitle>
          <SheetDescription className="text-center">
            {mode === "add" && "Добавление нового объекта"}
            {mode === "edit" && `Редактирвоание объекта`}
            {mode === "details" && `Подробная информация об объекте`}
            {mode === "change foreman" && `Смена бригадира на объекте`}
            {mode === "add employee" &&
              `Выберите сотрудников для назначения на объект`}
            {mode === "close object" &&
              `Подтверждения и сверка для закрытия объекта`}
          </SheetDescription>
        </SheetHeader>

        {mode === "add" && <ObjectAdd />}
        {mode === "edit" && selectedObject && (
          <ObjectEdit object={selectedObject} />
        )}
        {mode === "details" && selectedObject && (
          <ObjectDetails object={selectedObject} />
        )}
        {mode === "add employee" && selectedObject && (
          <ObjectAddEmployee object={selectedObject} />
        )}
        {mode === "close object" && selectedObject && (
          <CloseObject object={selectedObject} />
        )}
        {mode === "change foreman" && selectedObject && (
          <ChangeForeman object={selectedObject} />
        )}
      </SheetContent>
    </Sheet>
  );
}
