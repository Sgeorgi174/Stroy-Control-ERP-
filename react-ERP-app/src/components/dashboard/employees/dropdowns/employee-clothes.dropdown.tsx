import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import type { EmployeeClothingItem } from "@/types/employeesClothing";

type EmployeeClothingDropDownProps = { employeeClohing: EmployeeClothingItem };

export function EmployeeClothingDropDown({
  employeeClohing,
}: EmployeeClothingDropDownProps) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Изменить долг</DropdownMenuItem>
          <DropdownMenuItem>Списать долг</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
