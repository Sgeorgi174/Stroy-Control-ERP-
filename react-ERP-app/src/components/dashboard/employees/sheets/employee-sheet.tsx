import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useEmployeeSheetStore } from "@/stores/employee-sheet-store";
import { EmployeeCreate } from "./create-employee";
import { EmployeeUpdate } from "./update-employee";
import { EmployeeDetails } from "./employee-details";
import { EmployeeChangeObject } from "./change-object";
import { EmployeeSkillsEdit } from "./employee-skills";
import { EmployeeArchive } from "./archive-employee";
import type { EmployeeStatuses } from "@/types/employee";
import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const getStatusColor = (status: EmployeeStatuses) => {
  switch (status) {
    case "OK":
      return "bg-green-100 text-green-800";
    case "WARNING":
      return "bg-yellow-100 text-yellow-800";
    case "OVERDUE":
      return "bg-red-100 text-red-800";
    case "INACTIVE":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: EmployeeStatuses) => {
  switch (status) {
    case "OK":
      return "🟢";
    case "WARNING":
      return "🟡";
    case "OVERDUE":
      return "🔴";
    case "INACTIVE":
      return "⚫";
    default:
      return "⚫";
  }
};

const getStatusLabel = (status: EmployeeStatuses) => {
  switch (status) {
    case "OK":
      return "Ок";
    case "WARNING":
      return "Требует внимания";
    case "OVERDUE":
      return "Срочное решение";
    case "INACTIVE":
      return "Неактивный";
    default:
      return "⚫";
  }
};

export function EmployeeSheet() {
  const { isOpen, mode, selectedEmployee, closeSheet } =
    useEmployeeSheetStore();

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent
        className="w-[900px] sm:max-w-[900px] overflow-auto"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle className="text-center text-xl font-medium">
            {mode === "create" ? (
              "Новый сотрудник"
            ) : (
              <div>
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex flex-col items-start">
                    <p>
                      {selectedEmployee?.lastName} {selectedEmployee?.firstName}{" "}
                      {selectedEmployee?.fatherName}
                    </p>
                    <p className="text-lg text-muted-foreground">
                      {selectedEmployee && selectedEmployee.position}
                    </p>
                  </div>
                </div>
                {selectedEmployee && (
                  <div className="flex items-center gap-2 mt-5">
                    <Badge
                      className={`${getStatusColor(
                        selectedEmployee.status,
                      )} flex items-center gap-1`}
                    >
                      <span>{getStatusIcon(selectedEmployee.status)}</span>
                      {getStatusLabel(selectedEmployee.status)}
                    </Badge>
                    <Badge variant="outline">
                      {selectedEmployee.type === "ACTIVE"
                        ? "Актуальный"
                        : "Архив"}
                    </Badge>
                  </div>
                )}
              </div>
            )}
          </SheetTitle>
          <SheetDescription className="text-center text-transparent w-0 h-0">
            {mode === "create" && "Добавление нового сотрудника"}
            {mode === "details" && `Подробная информация о сотруднике`}
            {mode === "skills" && `Редактирование навыков сотрудника`}
            {mode === "edit" && `Редактирвоание сотрудника`}
            {mode === "change object" && `Смена объекта`}
            {mode === "archive" && `Перенос сотрудника в архив`}
          </SheetDescription>
        </SheetHeader>

        {mode === "create" && <EmployeeCreate />}
        {mode === "details" && selectedEmployee && (
          <EmployeeDetails employee={selectedEmployee} />
        )}
        {mode === "skills" && selectedEmployee && (
          <EmployeeSkillsEdit employee={selectedEmployee} />
        )}
        {mode === "edit" && selectedEmployee && (
          <EmployeeUpdate employee={selectedEmployee} />
        )}
        {mode === "change object" && selectedEmployee && (
          <EmployeeChangeObject employee={selectedEmployee} />
        )}
        {mode === "archive" && selectedEmployee && (
          <EmployeeArchive employee={selectedEmployee} />
        )}
      </SheetContent>
    </Sheet>
  );
}
