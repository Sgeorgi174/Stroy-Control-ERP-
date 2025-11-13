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

  const positionStats = employees.reduce<Record<string, number>>((acc, emp) => {
    const pos = emp.position || "Без должности";
    acc[pos] = (acc[pos] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <EmployeesFilter />
      <div className="bg-muted p-2 pl-4 rounded-xl mt-5 flex gap-4">
        <p>
          Всего сотрудников:{" "}
          <span className="font-medium">{employees.length}</span>
        </p>

        {Object.entries(positionStats).length > 0 && (
          <div className="space-y-1">
            {Object.entries(positionStats).map(([position, count]) => (
              <p key={position}>
                {position}: <span className="font-medium">{count}</span>
              </p>
            ))}
          </div>
        )}
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
