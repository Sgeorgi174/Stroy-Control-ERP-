import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import type { Employee } from "@/types/employee";
import { useEmployeeSheetStore } from "@/stores/employee-sheet-store";
import { AlertDialogDelete } from "../../alert-dialog-delete";
import { useDeleteEmployee } from "@/hooks/employee/useDeleteEmployee";
import { useState } from "react";
import { AlertDialogRestore } from "../alert-restore-employee";
import { useRestoreEmployee } from "@/hooks/employee/useRestoreEmployee";

type EmployeeDropDownProps = { employee: Employee };

export function EmployeeDropDown({ employee }: EmployeeDropDownProps) {
  const { openSheet } = useEmployeeSheetStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const { mutate: deleteEmployee, isPending: isDeleting } = useDeleteEmployee();
  const { mutate: restoreEmployee, isPending: isRestoring } =
    useRestoreEmployee();

  const handleDelete = () => {
    deleteEmployee(employee.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
      onError: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  const handleRestore = () => {
    restoreEmployee(employee.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
      onError: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => openSheet("details", employee)}>
            Подробнее
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {employee.type === "ACTIVE" && (
            <div>
              <DropdownMenuItem onClick={() => openSheet("skills", employee)}>
                Навыки
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openSheet("edit", employee)}>
                Редактировать
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openSheet("change object", employee)}
              >
                {employee.workPlace ? "Сменить объект" : "Назначить на объект"}
              </DropdownMenuItem>
              <DropdownMenuItem>Снять с объекта</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => openSheet("archive", employee)}
                variant="destructive"
              >
                Переместить в архив
              </DropdownMenuItem>
            </div>
          )}
          {employee.type === "ARCHIVE" && (
            <DropdownMenuItem onClick={() => setIsRestoreDialogOpen(true)}>
              Восстановить сотрудника
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            variant="destructive"
          >
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogDelete
        isDeleteDialogOpen={isDeleteDialogOpen}
        handleDelete={handleDelete}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        item={employee}
        isLoading={isDeleting}
      />

      <AlertDialogRestore
        isRestoreDialogOpen={isRestoreDialogOpen}
        handleRestore={handleRestore}
        setIsRestoreDialogOpen={setIsRestoreDialogOpen}
        item={employee}
        isLoading={isRestoring}
      />
    </>
  );
}
