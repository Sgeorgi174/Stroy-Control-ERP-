import { useQuery } from "@tanstack/react-query";
import { getStatusObject } from "@/services/api/user.api";

export const useGetStatusObject = () => {
  return useQuery({
    queryKey: ["status-object"],
    queryFn: getStatusObject,
  });
};
