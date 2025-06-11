import { EmployeesFilter } from "@/components/dashboard/employees/employees-filter";
import { EmployeesTable } from "@/components/dashboard/employees/tables/employees-table";
import { employees } from "@/constants/employees";

export function Employees() {
  return (
    <div>
      <EmployeesFilter />
      <EmployeesTable employees={employees} />
    </div>
  );
}
