import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getReturns } from "@/services/api/user.api";
import type { PendingTransfersResponse } from "@/types/transfers";

export const useUserReturns = (): UseQueryResult<
  PendingTransfersResponse,
  Error
> => {
  return useQuery({
    queryKey: ["user-returns"],
    queryFn: getReturns,
    refetchInterval: 60_000, // Пуллинг каждую минуту
    refetchOnWindowFocus: false, // Отключаем рефетч при возвращении на вкладку
  });
};
