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
import { AlertDialogUnassignFromObject } from "../alert-remove-object";
import { useUnassignEmployee } from "@/hooks/employee/useUnassignEmployee";

type EmployeeDropDownProps = { employee: Employee };

export function EmployeeDropDown({ employee }: EmployeeDropDownProps) {
  const { openSheet } = useEmployeeSheetStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [isUnassignDialogOpen, setIsUnassignDialogOpen] = useState(false);

  const { mutate: deleteEmployee, isPending: isDeleting } = useDeleteEmployee();
  const { mutate: unassignEmployee, isPending: isTransfer } =
    useUnassignEmployee();
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
        setIsRestoreDialogOpen(false); // поправлено: закрываем диалог восстановления, а не удаления
      },
      onError: () => {
        setIsRestoreDialogOpen(false);
      },
    });
  };

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
              openSheet("details", employee);
            }}
          >
            Подробнее
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {employee.type === "ACTIVE" && (
            <>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  openSheet("skills", employee);
                }}
              >
                Навыки
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  openSheet("edit", employee);
                }}
              >
                Редактировать
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  openSheet("change object", employee);
                }}
              >
                {employee.workPlace ? "Сменить объект" : "Назначить на объект"}
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

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  openSheet("archive", employee);
                }}
                variant="destructive"
              >
                Переместить в архив
              </DropdownMenuItem>
            </>
          )}

          {employee.type === "ARCHIVE" && (
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setIsRestoreDialogOpen(true);
              }}
            >
              Восстановить сотрудника
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteDialogOpen(true);
            }}
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

      <AlertDialogUnassignFromObject
        isUnassignDialogOpen={isUnassignDialogOpen}
        handleUnassign={handleUnassign}
        setIsUnassignDialogOpen={setIsUnassignDialogOpen}
        item={employee}
        isLoading={isTransfer}
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
