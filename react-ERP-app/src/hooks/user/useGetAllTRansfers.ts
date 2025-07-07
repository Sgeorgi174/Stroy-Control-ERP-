import { useQuery } from "@tanstack/react-query";
import { getTransfers } from "@/services/api/user.api";
import type { PendingTransfersResponse } from "@/types/transfers";

export const useGetTransfers = (params: {
  status?: string | null;
  fromObjectId?: string | null;
  toObjectId?: string | null;
  updatedAt?: string;
}) => {
  return useQuery<PendingTransfersResponse, Error>({
    queryKey: ["transfers", params],
    queryFn: () => getTransfers(params),
    enabled: true, // можешь поставить false, если нужен отложенный запуск
  });
};
