import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Employee } from "@/types/employee";
import { SkillsPopover } from "./skills-popover";
import { EmployeeDropDown } from "../employee-dropdown";

type EmployeesTableProps = {
  employees: Employee[];
};

const positionMap = {
  FOREMAN: "Бригадир",
  ELECTRICAN: "Электромонтажник",
  LABORER: "Разнорабочий",
  DESIGNER: "Проектировщик",
  ENGINEER: "Инженер",
};

export function EmployeesTable({ employees }: EmployeesTableProps) {
  console.log(employees);

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
            <TableHead className="text-secondary font-bold">Навыки</TableHead>
            <TableHead className="text-secondary font-bold text-center ">
              Статус
            </TableHead>

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
              <TableCell className="w-[150px]">
                <SkillsPopover skills={employee.skills} />
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2">
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
              <TableCell>
                <EmployeeDropDown employee={employee} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
