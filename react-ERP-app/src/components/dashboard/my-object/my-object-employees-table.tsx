import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { Employee } from "@/types/employee";
import { PendingTable } from "../storage/tables/pending-table";
import { SkillsPopover } from "../employees/tables/skills-popover";
import { MyObjectEmployeeDropDown } from "./my-object-employyes-dropdown";

type EmployeesTableProps = {
  employees: Employee[];
  isLoading: boolean;
  isError: boolean;
};

export function MyObjectEmployeesTable({
  employees,
  isError,
  isLoading,
}: EmployeesTableProps) {
  return (
    <div className="mt-3 pb-3 border-t-1">
      <Table>
        <TableBody>
          <PendingTable
            data={employees}
            isError={isError}
            isLoading={isLoading}
          />
          {employees.map((employee, index) => (
            <TableRow key={employee.id} className="cursor-pointer">
              <TableCell className="w-[50px]">{index + 1}</TableCell>
              <TableCell className="font-medium hover:underline">{`${
                employee.lastName
              } ${employee.firstName.charAt(0)}.${employee.fatherName.charAt(
                0
              )}.`}</TableCell>
              <TableCell>{employee.phoneNumber}</TableCell>
              <TableCell className="w-[150px]">
                <div onClick={(e) => e.stopPropagation()}>
                  <SkillsPopover skills={employee.skills} />
                </div>
              </TableCell>
              <TableCell className="flex justify-end">
                <div onClick={(e) => e.stopPropagation()}>
                  <MyObjectEmployeeDropDown employee={employee} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
