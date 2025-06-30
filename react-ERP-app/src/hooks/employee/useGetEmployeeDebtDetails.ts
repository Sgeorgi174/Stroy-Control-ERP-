import { useQuery } from "@tanstack/react-query";
import { getEmployeeDebtDetails } from "@/services/api/employee.api";
import type { EmployeeClothing } from "@/types/employeesClothing";

export const useGetEmployeeDebtDetails = (id?: string) => {
  return useQuery<EmployeeClothing>({
    queryKey: ["employee-clothing", id],
    queryFn: () => getEmployeeDebtDetails(id!),
    enabled: !!id,
  });
};
