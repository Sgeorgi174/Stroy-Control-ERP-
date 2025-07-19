import { getFilteredEmployees } from "@/services/api/employee.api";
import type {
  EmployeeType,
  Positions,
  EmployeeStatuses,
  Employee,
} from "@/types/employee";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

interface FilterParams {
  searchQuery: string;
  objectId?: string | null;
  status?: EmployeeStatuses | null;
  position?: Positions | null;
  skillIds?: string;
  type?: EmployeeType | null;
}

export const useEmployees = (
  params: FilterParams,
  enabled = true
): UseQueryResult<Employee[], Error> => {
  return useQuery({
    queryKey: ["employees", params],
    queryFn: () => getFilteredEmployees(params),
    enabled,
  });
};
