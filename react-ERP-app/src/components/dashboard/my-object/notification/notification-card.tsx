import { Card } from "@/components/ui/card";
import { NotificationItem } from "./notification-item";
import type { Device } from "@/types/device";
import type { Tool } from "@/types/tool";
import { useUserNotifications } from "@/hooks/user/useGetNotification";
import type { ClothesTransfer } from "@/types/clothesTransfer";

export function NotificationCard() {
  const { data, isLoading, isError } = useUserNotifications();

  const unconfirmed = [
    ...(data?.unconfirmedTools?.map((item: Tool) => ({
      ...item,
      itemType: "tool",
    })) ?? []),
    ...(data?.unconfirmedDevices?.map((item: Device) => ({
      ...item,
      itemType: "device",
    })) ?? []),
    ...(data?.unconfirmedClothes?.map((item: ClothesTransfer) => ({
      ...item,
      itemType: "clothes",
    })) ?? []),
  ];

  return (
    <Card className="w-[700px] max-h-[480px] overflow-auto bg-accent p-5">
      {isLoading && (
        <div className="w-full h-full flex justify-center items-center text-xl text-muted-foreground">
          Загрузка уведомлений...
        </div>
      )}

      {isError && (
        <div className="w-full h-full flex justify-center items-center text-xl text-red-500">
          Ошибка при загрузке уведомлений
        </div>
      )}

      {!isLoading && !isError && unconfirmed.length === 0 && (
        <div className="w-full h-full flex justify-center items-center text-2xl text-gray-200">
          Новых уведомлений нет
        </div>
      )}

      {unconfirmed.map((item) => (
        <NotificationItem key={item.id} item={item} />
      ))}
    </Card>
  );
}
