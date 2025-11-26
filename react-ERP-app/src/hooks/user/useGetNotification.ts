// src/hooks/user/useUserNotifications.ts
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getUserNotifications } from "@/services/api/user.api";
import type { PendingTransfersResponse } from "@/types/transfers";

export const useUserNotifications = (
  objectId: string
): UseQueryResult<PendingTransfersResponse, Error> => {
  return useQuery({
    queryKey: ["user-notifications"],
    queryFn: () => getUserNotifications(objectId),
    refetchInterval: 60_000, // Пуллинг каждую минуту
    refetchOnWindowFocus: false, // Отключаем рефетч при возвращении на вкладку
  });
};
