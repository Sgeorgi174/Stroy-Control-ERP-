import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Employee } from "@/types/employee";

type EmployeesOnObjectTableProps = { employees: Employee[] };

const positionMap = {
  FOREMAN: "Бригадир",
  ELECTRICAN: "Электромонтажник",
  LABORER: "Разнорабочий",
};

export function EmployeesOnObjectTable({
  employees,
}: EmployeesOnObjectTableProps) {
  return (
    <Table className="mt-6">
      <TableHeader>
        <TableRow>
          <TableHead>Имя</TableHead>
          <TableHead>Номер телефона</TableHead>
          <TableHead>Должность</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
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
  );
}
