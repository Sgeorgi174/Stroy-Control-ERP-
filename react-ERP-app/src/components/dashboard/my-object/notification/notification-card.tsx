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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

type TransferNotification =
  | ({ type: "tool" } & PendingToolTransfer)
  | ({ type: "device" } & PendingDeviceTransfer)
  | ({ type: "clothes" } & PendingClothesTransfer);

export function NotificationCard() {
  const { data: myObject, isLoading: isLoadingGetObject } =
    useGetStatusObject();

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
    <Tabs defaultValue="important" className="w-[720px] gap-0 ">
      {/* TabsList СНАРУЖИ — без паддингов и без скролла */}
      <TabsList className="w-full h-[40px] sticky top-0 z-3 bg-accent border border-b-0 rounded-b-none rounded-t-xl">
        <TabsTrigger value="important">
          Важное
          <Badge className="ml-2 rounded-full bg-muted text-muted-foreground">
            {myObject ? 1 : 0}
          </Badge>
        </TabsTrigger>

        <TabsTrigger
          disabled={myObject?.isPending || isLoadingGetObject}
          value="transfers"
        >
          Перемещения
          <Badge className="ml-2 rounded-full bg-muted text-muted-foreground">
            {sortedNotifications.length}
          </Badge>
        </TabsTrigger>

        <TabsTrigger
          disabled={myObject?.isPending || isLoadingGetObject}
          value="employees"
        >
          Сотрудники
          <Badge className="ml-2 rounded-full bg-muted text-muted-foreground">
            0
          </Badge>
        </TabsTrigger>
      </TabsList>

      {/* Только контент в скролле и в карточке */}
      <ScrollArea
        scrollHideDelay={0}
        className="w-[720px] max-h-[550px] min-h-[550px] bg-accent border border-t-0 rounded-b-xl"
      >
        <div className="bg-accent min-h-full p-2 pr-4">
          {/* Важное */}
          <TabsContent value="important">
            {myObject ? (
              <NotificationPanel
                tools={myObject.tools}
                devices={myObject.devices}
                clothes={myObject.clothes}
                objectId={myObject.id}
              />
            ) : (
              <div className="w-full py-6 text-center text-muted-foreground/50">
                Нет важных уведомлений
              </div>
            )}
          </TabsContent>

          {/* Перемещения */}
          <TabsContent className="flex flex-col gap-3" value="transfers">
            {isLoading && (
              <div className="w-full py-6 text-center text-muted-foreground/50">
                Загрузка уведомлений...
              </div>
            )}
            {isError && (
              <div className="w-full py-6 text-center text-red-500">
                Ошибка при загрузке уведомлений
              </div>
            )}
            {!isLoading && !isError && sortedNotifications.length === 0 && (
              <div className="w-full py-6 text-center text-gray-200">
                Новых уведомлений нет
              </div>
            )}
            {!isLoading &&
              !isError &&
              sortedNotifications.map((item) => {
                const key = `${item.type}-${item.id}`;
                switch (item.type) {
                  case "tool":
                    return <ToolNotification key={key} toolTransfer={item} />;
                  case "device":
                    return (
                      <DeviceNotification key={key} deviceTransfer={item} />
                    );
                  case "clothes":
                    return (
                      <ClothesNotification key={key} clothesTransfer={item} />
                    );
                  default:
                    return null;
                }
              })}
          </TabsContent>

          {/* Сотрудники */}
          <TabsContent value="employees">
            <div className="w-full py-6 text-center text-muted-foreground/50">
              Уведомлений по сотрудникам пока нет
            </div>
          </TabsContent>
        </div>
      </ScrollArea>
    </Tabs>
  );
}
