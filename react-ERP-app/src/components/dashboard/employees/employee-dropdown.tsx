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

type EmployeeDropDownProps = { employee: Employee };

export function EmployeeDropDown({ employee }: EmployeeDropDownProps) {
  const { openSheet } = useEmployeeSheetStore();

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
          <DropdownMenuItem onClick={() => openSheet("skills", employee)}>
            Навыки
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openSheet("edit", employee)}>
            Редактировать
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => openSheet("change object", employee)}
          >
            Сменить объект
          </DropdownMenuItem>
          <DropdownMenuItem>Снять с объекта</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => openSheet("archive", employee)}
            variant="destructive"
          >
            Переместить в архив
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Удалить</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
