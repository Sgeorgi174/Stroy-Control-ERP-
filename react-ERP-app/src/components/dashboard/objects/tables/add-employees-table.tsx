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
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardHat } from "lucide-react";

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
    <Card className="gap-3">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <HardHat className="w-5 h-5" />
          Добавить сотрудников
        </CardTitle>
      </CardHeader>
      <CardContent>
        {employees.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имя</TableHead>
                <TableHead>Должность</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => {
                const isSelected = selectedIds.includes(employee.id);
                return (
                  <TableRow
                    key={employee.id}
                    className={cn({ "bg-muted/100": isSelected })}
                  >
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelectOne(employee.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {employee.firstName} {employee.lastName}
                    </TableCell>
                    <TableCell>{positionMap[employee.position]}</TableCell>
                    <TableCell>{employee.phoneNumber}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <p className="text-gray-500 text-sm text-center py-8">
            На объекте нет сотрудников
          </p>
        )}
      </CardContent>
    </Card>
  );
}
