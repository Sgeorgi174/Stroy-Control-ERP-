import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import type { Employee } from "@/types/employee";
import { useState } from "react";
import { PendingTable } from "../../storage/tables/pending-table";
import { cn } from "@/lib/utils"; // обязательно должен быть подключен ваш `cn`

type AddEmployeesTableProps = {
  employees: Employee[];
  isLoading: boolean;
  isError: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
};

const positionMap = {
  FOREMAN: "Бригадир",
  ELECTRICAN: "Электромонтажник",
  LABORER: "Разнорабочий",
  DESIGNER: "Проектировщик",
  ENGINEER: "Инженер",
};

export function AddEmployeesTable({
  employees,
  isLoading,
  isError,
  onSelectionChange,
}: AddEmployeesTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelectOne = (id: string) => {
    let updated: string[];

    if (selectedIds.includes(id)) {
      updated = selectedIds.filter((selectedId) => selectedId !== id);
    } else {
      updated = [...selectedIds, id];
    }

    setSelectedIds(updated);
    onSelectionChange?.(updated);
  };

  return (
    <div className="mt-6 rounded-lg border overflow-hidden">
      <Table>
        <TableHeader className="bg-primary pointer-events-none">
          <TableRow>
            <TableHead className="w-[40px]" />
            <TableHead className="text-secondary font-medium">ФИО</TableHead>
            <TableHead className="text-secondary font-medium">
              Номер телефона
            </TableHead>
            <TableHead className="text-secondary font-medium">
              Должность
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <PendingTable
            isLoading={isLoading}
            isError={isError}
            data={employees}
          />
          {employees.map((employee) => {
            const isSelected = selectedIds.includes(employee.id);

            return (
              <TableRow
                key={employee.id}
                className={cn({ "bg-muted/50": isSelected })}
              >
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleSelectOne(employee.id)}
                  />
                </TableCell>
                <TableCell>{`${employee.lastName} ${employee.firstName} ${
                  employee.fatherName ?? ""
                }`}</TableCell>
                <TableCell>{employee.phoneNumber}</TableCell>
                <TableCell>{positionMap[employee.position]}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
