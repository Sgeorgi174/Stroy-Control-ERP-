import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CircleDashed } from "lucide-react";
import type { NotificationWithType } from "@/types/notificationWithType";
import { ConfirmTransferDialog } from "./confirm-transfer-dialog";

type NotificationItemProps = {
  item: NotificationWithType;
};

export function NotificationItem({ item }: NotificationItemProps) {
  const isClothes = item.itemType === "clothes";

  return (
    <Card className="flex flex-row items-center justify-between p-4 space-y-1">
      <div className="flex gap-5">
        <CircleDashed className="animate-spin text-muted-foreground" />
        <div>
          <p>
            Перемещение: <span className="font-medium">{item.name}</span>
          </p>

          <div className="flex gap-3 mt-1 flex-wrap">
            {!isClothes && (
              <p className="text-gray-400 text-[13px]">
                Серийный номер: <span>{item.serialNumber}</span>
              </p>
            )}

            {isClothes && (
              <>
                <p className="text-gray-400 text-[13px]">
                  Количество:{" "}
                  <span className="font-medium">{item.inTransit}</span>
                </p>
                <p className="text-gray-400 text-[13px]">
                  Размер: <span className="font-medium">{item.size}</span>
                </p>
                <p className="text-gray-400 text-[13px]">
                  Сезон:{" "}
                  <span className="font-medium">
                    {item.season === "SUMMER" ? "Лето" : "Зима"}
                  </span>
                </p>
              </>
            )}
          </div>

          <div className="flex items-center gap-5 mt-7">
            <p className="text-gray-400 text-xs">
              Кому:
              <span>{` ${item.storage.foreman?.lastName} ${item.storage.foreman?.firstName}`}</span>
            </p>
            <p className="text-gray-400 text-xs">
              Объект:
              <span>{` ${item.storage.name}`}</span>
            </p>
          </div>
        </div>
      </div>

      <ConfirmTransferDialog
        item={item}
        trigger={<Button>Подтвердить</Button>}
      />
    </Card>
  );
}
