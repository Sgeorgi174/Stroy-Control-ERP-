import { getEmployeeDocuments } from "@/services/api/employee.api";
import { useQuery } from "@tanstack/react-query";

export const useEmployeeDocuments = (employeeId: string) =>
  useQuery({
    queryKey: ["employee-documents", employeeId],
    queryFn: () => getEmployeeDocuments(employeeId),
    enabled: Boolean(employeeId),
  });
