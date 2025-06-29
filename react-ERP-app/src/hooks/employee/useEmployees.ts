import { getFilteredEmployees } from "@/services/api/employee.api";
import type { EmployeeType, Positions, Statuses } from "@/types/employee";
import { useQuery } from "@tanstack/react-query";

interface FilterParams {
  searchQuery: string;
  objectId?: string | null;
  status?: Statuses | null;
  position?: Positions | null;
  skillIds?: string;
  type?: EmployeeType | null;
}

export const useEmployees = (params: FilterParams, enabled = true) => {
  return useQuery({
    queryKey: ["employees", params],
    queryFn: () => getFilteredEmployees(params),
    enabled,
  });
};
