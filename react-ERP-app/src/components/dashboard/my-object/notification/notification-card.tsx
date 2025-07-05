import { Card } from "@/components/ui/card";
import { useUserNotifications } from "@/hooks/user/useGetNotification";
import { useGetStatusObject } from "@/hooks/user/useGetStatusObject";
import NotificationPanel from "./accept-object-notification/accept-object";
import ToolNotification from "./tool-notification/tool-notification";
import type {
  PendingToolTransfer,
  PendingDeviceTransfer,
  PendingClothesTransfer,
} from "@/types/transfers";
import DeviceNotification from "./device-notification/device-notification";
import ClothesNotification from "./clothes-notification/clothes-notification";

type TransferNotification =
  | ({ type: "tool" } & PendingToolTransfer)
  | ({ type: "device" } & PendingDeviceTransfer)
  | ({ type: "clothes" } & PendingClothesTransfer);

export function NotificationCard() {
  const { data: myObject } = useGetStatusObject();

  const {
    data: unconfirmedItems = { tools: [], devices: [], clothes: [] },
    isLoading,
    isError,
  } = useUserNotifications();

  const allNotifications: TransferNotification[] = [
    ...unconfirmedItems.tools.map((t) => ({ ...t, type: "tool" as const })),
    ...unconfirmedItems.devices.map((d) => ({ ...d, type: "device" as const })),
    ...unconfirmedItems.clothes.map((c) => ({
      ...c,
      type: "clothes" as const,
    })),
  ];

  const sortedNotifications = allNotifications.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <Card className="w-[700px] max-h-[480px] overflow-auto bg-accent p-5">
      {myObject && (
        <NotificationPanel
          tools={myObject.tools}
          devices={myObject.devices}
          clothes={myObject.clothes}
          objectId={myObject.id}
        />
      )}

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

      {!isLoading && !isError && sortedNotifications.length === 0 && (
        <div className="w-full h-full flex justify-center items-center text-2xl text-gray-200">
          Новых уведомлений нет
        </div>
      )}

      {sortedNotifications.map((item) => {
        const key = `${item.type}-${item.id}`; // 🔑 уникальный ключ

        switch (item.type) {
          case "tool":
            return <ToolNotification key={key} toolTransfer={item} />;
          case "device":
            return <DeviceNotification key={key} deviceTransfer={item} />;
          case "clothes":
            return <ClothesNotification key={key} clothesTransfer={item} />;
          default:
            return null;
        }
      })}
    </Card>
  );
}
