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
    selectedEmployeeStatus,
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
      status: selectedEmployeeStatus ?? undefined,
      skillIds: selectedSkills.join(","),
      type: selectedEmployeeType,
    },
    activeTab === "employee"
  );

  return (
    <div>
      <EmployeesFilter />
      <div className="bg-muted p-2 pl-4 rounded-xl mt-5 flex items-center gap-10">
        {/* Всего сотрудников */}
        <p>
          Всего сотрудников:{" "}
          <span className="font-medium">{employees.length}</span>
        </p>

        {/* OK */}
        <div className="flex items-center gap-2">
          <p className="h-3 w-3 rounded-full glow-green"></p>
          <p>:</p>
          <span className="font-medium">
            {employees.reduce(
              (acc, e) => (e.status === "OK" ? acc + 1 : acc),
              0
            )}
          </span>
        </div>

        {/* WARNING */}
        <div className="flex items-center gap-2">
          <p className="h-3 w-3 rounded-full glow-yellow"></p>
          <p>:</p>
          <span className="font-medium">
            {employees.reduce(
              (acc, e) => (e.status === "WARNING" ? acc + 1 : acc),
              0
            )}
          </span>
        </div>

        {/* OVERDUE */}
        <div className="flex items-center gap-2">
          <p className="h-3 w-3 rounded-full glow-red"></p>
          <p>:</p>
          <span className="font-medium">
            {employees.reduce(
              (acc, e) => (e.status === "OVERDUE" ? acc + 1 : acc),
              0
            )}
          </span>
        </div>
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
