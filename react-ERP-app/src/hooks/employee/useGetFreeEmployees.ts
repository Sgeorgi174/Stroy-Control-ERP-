import { getFreeEmployees } from "@/services/api/employee.api";
import { useQuery } from "@tanstack/react-query";

export const useGetFreeEmployees = () => {
  return useQuery({
    queryKey: ["free-employees"],
    queryFn: () => getFreeEmployees(),
  });
};
