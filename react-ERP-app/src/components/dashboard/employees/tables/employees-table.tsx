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
import { EmployeeDropDown } from "../dropdowns/employee-dropdown";
import { PendingTable } from "../../storage/tables/pending-table";
import { positionMap } from "@/constants/positionMap";
import { useEmployeeSheetStore } from "@/stores/employee-sheet-store";

type EmployeesTableProps = {
  employees: Employee[];
  isLoading: boolean;
  isError: boolean;
};

export function EmployeesTable({
  employees,
  isError,
  isLoading,
}: EmployeesTableProps) {
  const { openSheet } = useEmployeeSheetStore();
  return (
    <div className="mt-6 rounded-lg border overflow-hidden">
      <Table>
        <TableHeader className="bg-primary pointer-events-none">
          <TableRow>
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
          <PendingTable
            data={employees}
            isError={isError}
            isLoading={isLoading}
          />
          {employees.map((employee) => (
            <TableRow
              key={employee.id}
              onClick={() => openSheet("details", employee)}
              className="cursor-pointer"
            >
              <TableCell className="font-medium hover:underline">{`${employee.lastName} ${employee.firstName} ${employee.fatherName}`}</TableCell>
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
