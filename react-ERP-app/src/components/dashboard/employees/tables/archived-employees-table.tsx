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
import { formatDate } from "@/lib/utils/format-date";

type ArchiveEmployeesTableProps = {
  employees: Employee[];
  isLoading: boolean;
  isError: boolean;
};

export function ArchiveEmployeesTable({
  employees,
  isError,
  isLoading,
}: ArchiveEmployeesTableProps) {
  return (
    <div className="mt-6 rounded-lg border overflow-hidden">
      <Table>
        <TableHeader className="bg-primary pointer-events-none">
          <TableRow>
            <TableHead className="w-[30px]"></TableHead>
            <TableHead className="text-secondary font-bold">
              Дата архивации
            </TableHead>
            <TableHead className="text-secondary font-bold">
              Кто архивировал
            </TableHead>
            <TableHead className="text-secondary font-bold">Причина</TableHead>
            <TableHead className="text-secondary font-bold">
              Сотрудник
            </TableHead>
            <TableHead className="text-secondary font-bold">Телефон</TableHead>
            <TableHead className="text-secondary font-bold">Навыки</TableHead>
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
            <TableRow key={employee.id}>
              <TableCell></TableCell>
              <TableCell>
                {employee.archive && formatDate(employee.archive.archivedAt)}
              </TableCell>
              <TableCell>
                {employee.archive &&
                  `${employee.archive.changedBy.lastName} ${employee.archive.changedBy.firstName}`}
              </TableCell>

              <TableCell>
                {employee.archive && employee.archive.comment}
              </TableCell>
              <TableCell className="font-medium">{`${employee.lastName} ${employee.firstName} ${employee.fatherName}`}</TableCell>
              <TableCell className="font-medium">
                {employee.phoneNumber}
              </TableCell>
              <TableCell className="w-[150px]">
                <SkillsPopover skills={employee.skills} />
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
