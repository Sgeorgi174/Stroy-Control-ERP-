import type { Object } from "@/types/object";
import { EmployeesOnObjectTable } from "../tables/employees-on-object";
import { useEmployees } from "@/hooks/employee/useEmployees";
import { ObjectDetailsBox } from "./object-details-box";

type ObjectDetailsProps = { object: Object };

export function ObjectDetails({ object }: ObjectDetailsProps) {
  const {
    data: employees = [],
    isError,
    isLoading,
  } = useEmployees({ searchQuery: "", objectId: object.id });

  return (
    <div className="p-5 flex flex-col gap-5 mt-4">
      <ObjectDetailsBox object={object} />
      <EmployeesOnObjectTable
        employees={employees}
        isError={isError}
        isLoading={isLoading}
      />
    </div>
  );
}
