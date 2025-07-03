import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getAllTransfers } from "@/services/api/user.api";
import type { PendingTransfersResponse } from "@/types/transfers";

export const useGetAllTransfers = (): UseQueryResult<
  PendingTransfersResponse,
  Error
> => {
  return useQuery({
    queryKey: ["transfers"],
    queryFn: getAllTransfers,
  });
};
