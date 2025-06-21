// src/hooks/user/useUserNotifications.ts
import { useQuery } from "@tanstack/react-query";
import { getUserNotifications } from "@/services/api/user.api";

export const useUserNotifications = () => {
  return useQuery({
    queryKey: ["user-notifications"],
    queryFn: getUserNotifications,
    refetchInterval: 60_000, // Пуллинг каждую минуту
    refetchOnWindowFocus: false, // Отключаем рефетч при возвращении на вкладку
  });
};
