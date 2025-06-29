import { useQuery } from "@tanstack/react-query";
import { getEmployeeById } from "@/services/api/employee.api";

export const useEmployeeById = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: () => getEmployeeById(id),
    enabled: !!id && enabled,
  });
};
