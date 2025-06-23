import { EmployeesFilter } from "@/components/dashboard/employees/employees-filter";
import { EmployeesTable } from "@/components/dashboard/employees/tables/employees-table";
import { useEmployees } from "@/hooks/employee/useEmployees";
import { useFilterPanelStore } from "@/stores/filter-panel-store";

export function Employees() {
  const { searchQuery, selectedObjectId } = useFilterPanelStore();
  const { data: employees = [] } = useEmployees({
    searchQuery,
    objectId: selectedObjectId,
    position: null,
    status: null,
  });
  return (
    <div>
      <EmployeesFilter />
      <EmployeesTable employees={employees} />
    </div>
  );
}
