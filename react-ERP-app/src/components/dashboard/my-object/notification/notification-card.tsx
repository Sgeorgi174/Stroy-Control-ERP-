import { Card } from "@/components/ui/card";
import { useUserNotifications } from "@/hooks/user/useGetNotification";
import { useGetStatusObject } from "@/hooks/user/useGetStatusObject";
import NotificationPanel from "./accept-object";
import ToolNotification from "./tool-notification";

export function NotificationCard() {
  const { data: myObject } = useGetStatusObject();

  const {
    data: unconfirmedItems = { tools: [], devices: [], clothes: [] },
    isLoading,
    isError,
  } = useUserNotifications();

  const hasUnconfirmedItems =
    unconfirmedItems.tools.length > 0 ||
    unconfirmedItems.devices.length > 0 ||
    unconfirmedItems.clothes.length > 0;

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

      {!isLoading && !isError && !hasUnconfirmedItems && (
        <div className="w-full h-full flex justify-center items-center text-2xl text-gray-200">
          Новых уведомлений нет
        </div>
      )}

      {unconfirmedItems.tools.map((toolTransfer) => (
        <ToolNotification key={toolTransfer.id} toolTransfer={toolTransfer} />
      ))}
    </Card>
  );
}
