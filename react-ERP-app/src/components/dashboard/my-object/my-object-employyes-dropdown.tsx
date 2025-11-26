import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import type { Employee } from "@/types/employee";
import { useEmployeeSheetStore } from "@/stores/employee-sheet-store";
import { useState } from "react";
import { useUnassignEmployee } from "@/hooks/employee/useUnassignEmployee";
import { AlertDialogUnassignFromObject } from "../employees/alert-remove-object";

type EmployeeDropDownProps = { employee: Employee };

export function MyObjectEmployeeDropDown({ employee }: EmployeeDropDownProps) {
  const { openSheet } = useEmployeeSheetStore();

  const [isUnassignDialogOpen, setIsUnassignDialogOpen] = useState(false);

  const { mutate: unassignEmployee, isPending: isTransfer } =
    useUnassignEmployee();

  const handleUnassign = () => {
    unassignEmployee(employee.id, {
      onSuccess: () => {
        setIsUnassignDialogOpen(false); // поправлено: закрываем именно диалог отвязки
      },
      onError: () => {
        setIsUnassignDialogOpen(false);
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        {/* Остановка всплытия на триггере */}
        <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
          <button className="hover:bg-accent p-1 rounded cursor-pointer">
            <EllipsisVertical />
          </button>
        </DropdownMenuTrigger>

        {/* Остановка кликов внутри меню */}
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              openSheet("skills", employee);
            }}
          >
            Навыки
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={employee.objectId === null}
            onClick={(e) => {
              e.stopPropagation();
              setIsUnassignDialogOpen(true);
            }}
          >
            Снять с объекта
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogUnassignFromObject
        isUnassignDialogOpen={isUnassignDialogOpen}
        handleUnassign={handleUnassign}
        setIsUnassignDialogOpen={setIsUnassignDialogOpen}
        item={employee}
        isLoading={isTransfer}
      />
    </>
  );
}
