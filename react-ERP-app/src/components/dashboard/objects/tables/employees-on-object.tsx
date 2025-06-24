import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Employee } from "@/types/employee";
import { PendingTable } from "../../storage/tables/pending-table";

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
    <div className="mt-6 rounded-lg border overflow-hidden">
      <Table>
        <TableHeader className="bg-primary pointer-events-none">
          <TableRow>
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
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{`${employee.lastName} ${employee.firstName} ${
                employee.fatherName ? employee.fatherName : ""
              }`}</TableCell>
              <TableCell>{employee.phoneNumber}</TableCell>
              <TableCell>{positionMap[employee.position]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
