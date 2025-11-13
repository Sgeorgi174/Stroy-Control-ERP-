import { EmployeesFilter } from "@/components/dashboard/employees/employees-filter";
import { EmployeeSheet } from "@/components/dashboard/employees/sheets/employee-sheet";
import { ArchiveEmployeesTable } from "@/components/dashboard/employees/tables/archived-employees-table";
import { EmployeesTable } from "@/components/dashboard/employees/tables/employees-table";
import { useEmployees } from "@/hooks/employee/useEmployees";
import { useFilterPanelStore } from "@/stores/filter-panel-store";

export function Employees() {
  const {
    activeTab,
    searchQuery,
    selectedObjectId,
    selectedEmployeePosition,
    selectedSkills,
    selectedEmployeeType,
  } = useFilterPanelStore();
  const {
    data: employees = [],
    isLoading,
    isError,
  } = useEmployees(
    {
      searchQuery,
      objectId: selectedObjectId,
      position: selectedEmployeePosition,
      status: null,
      skillIds: selectedSkills.join(","),
      type: selectedEmployeeType,
    },
    activeTab === "employee"
  );

  return (
    <div>
      <EmployeesFilter />
      <div className="bg-muted p-2 pl-4 rounded-xl mt-5 flex gap-4">
        <p>
          Всего сотрудников:{" "}
          <span className="font-medium">{employees.length}</span>
        </p>
      </div>
      {selectedEmployeeType === "ACTIVE" && (
        <EmployeesTable
          employees={employees}
          isError={isError}
          isLoading={isLoading}
        />
      )}
      {selectedEmployeeType === "ARCHIVE" && (
        <ArchiveEmployeesTable
          employees={employees}
          isError={isError}
          isLoading={isLoading}
        />
      )}
      <EmployeeSheet />
    </div>
  );
}
