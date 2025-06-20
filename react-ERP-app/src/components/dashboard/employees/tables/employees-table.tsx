import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Employee } from "@/types/employee";
import { EllipsisVertical } from "lucide-react";

type EmployeesTableProps = {
  employees: Employee[];
};

const positionMap = {
  FOREMAN: "Бригадир",
  ELECTRICAN: "Электромонтажник",
  LABORER: "Разнорабочий",
};

export function EmployeesTable({ employees }: EmployeesTableProps) {
  return (
    <div className="mt-6 rounded-lg border overflow-hidden">
      <Table>
        <TableHeader className="bg-primary pointer-events-none">
          <TableRow>
            <TableHead className="w-[30px]"></TableHead>
            <TableHead className="text-secondary font-bold">ФИО</TableHead>
            <TableHead className="text-secondary font-bold">
              Должность
            </TableHead>
            <TableHead className="text-secondary font-bold">Телефон</TableHead>
            <TableHead className="text-secondary font-bold">Объект</TableHead>
            <TableHead className="text-secondary font-bold">Статус</TableHead>

            <TableHead className="text-secondary font-bold"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell></TableCell>
              <TableCell className="font-medium">{`${employee.lastName} ${employee.firstName} ${employee.fatherName}`}</TableCell>
              <TableCell>{positionMap[employee.position]}</TableCell>
              <TableCell>{employee.phoneNumber}</TableCell>
              <TableCell>
                {employee.workPlace ? employee.workPlace.name : "На назначен"}
              </TableCell>
              <TableCell>Работает</TableCell>
              <TableCell>
                <EllipsisVertical />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
