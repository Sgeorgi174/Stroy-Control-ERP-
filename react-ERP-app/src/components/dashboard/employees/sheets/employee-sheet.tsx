import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useEmployeeSheetStore } from "@/stores/employee-sheet-store";

export function EmployeeSheet() {
  const { isOpen, mode, selectedEmployee, closeSheet } =
    useEmployeeSheetStore();

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
            {mode === "create"
              ? "Новый сотрудник"
              : `${selectedEmployee?.lastName} ${selectedEmployee?.firstName} ${selectedEmployee?.fatherName}`}
          </SheetTitle>
          <SheetDescription className="text-center">
            {mode === "create" && "Добавление нового сотрудника"}
            {mode === "details" && `Подробная информация о сотруднике`}
            {mode === "skills" && `Редактирование навыков сотрудника`}
            {mode === "edit" && `Редактирвоание сотрудника`}
            {mode === "change object" && `Смена объекта`}
            {mode === "archive" && `Перенос сотрудника в архив`}
          </SheetDescription>
        </SheetHeader>

        {mode === "create" && <div>Работаем</div>}
        {mode === "details" && <div>Работаем</div>}
        {mode === "skills" && <div>Работаем</div>}
        {mode === "edit" && <div>Работаем</div>}
        {mode === "change object" && <div>Работаем</div>}
        {mode === "archive" && <div>Работаем</div>}
      </SheetContent>
    </Sheet>
  );
}
