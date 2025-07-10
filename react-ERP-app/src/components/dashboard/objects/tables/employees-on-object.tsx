import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Employee } from "@/types/employee";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardHat } from "lucide-react";

type EmployeesOnObjectTableProps = {
  employees: Employee[];
  isLoading: boolean;
  isError: boolean;
};

const positionMap = {
  FOREMAN: "Бригадир",
  ELECTRICAN: "Электромонтажник",
  LABORER: "Разнорабочий",
  DESIGNER: "Проектировщик",
  ENGINEER: "Инженер",
};

export function EmployeesOnObjectTable({
  employees,
  isLoading,
  isError,
}: EmployeesOnObjectTableProps) {
  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <HardHat className="w-5 h-5" />
          Сотрудники
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
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    {employee.firstName} {employee.lastName}
                  </TableCell>
                  <TableCell>{positionMap[employee.position]}</TableCell>
                  <TableCell>{employee.phoneNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-3 w-3 rounded-full text-center ${
                          employee.status === "OK"
                            ? "glow-green"
                            : employee.status === "WARNING"
                            ? "glow-yellow"
                            : employee.status === "INACTIVE"
                            ? "bg-gray-500"
                            : "glow-red"
                        }`}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
