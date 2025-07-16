import { User, MapPin, MoveRight, Minus, ArrowLeft } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type {
  PendingClothesTransfer,
  PendingDeviceTransfer,
  PendingToolTransfer,
} from "@/types/transfers";

type ReturnNotificationCardProps = {
  returnTransfer:
    | PendingToolTransfer
    | PendingClothesTransfer
    | PendingDeviceTransfer;
  onClick: () => void;
  type: "clothes" | "device" | "tool";
};

export function ReturnNotificationCard({
  returnTransfer,
  onClick,
  type,
}: ReturnNotificationCardProps) {
  const toolReturn = returnTransfer as PendingToolTransfer;
  const deviceReturn = returnTransfer as PendingDeviceTransfer;
  const clothesReturn = returnTransfer as PendingClothesTransfer;

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-primary transition-shadow duration-200 border-l-4 gap-2 border-l-orange-400"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange-400 flex items-center justify-center">
            <ArrowLeft className="w-7 h-7 text-secondary" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-medium leading-tight">
              Возврат
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              {type === "tool" && (
                <span>
                  Инструмент "{toolReturn.tool.name}" был возвращен на ваш
                  объект
                </span>
              )}
              {type === "device" && (
                <span>
                  Устройство "{deviceReturn.device.name}" было возвращено на ваш
                  объект
                </span>
              )}
              {type === "clothes" && (
                <span>
                  {clothesReturn.clothes.name}, была возвращена на ваш объект
                </span>
              )}

              <div className="flex gap-4">
                <div className="flex flex-col gap-2 mt-5">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>
                      {returnTransfer.fromObject.foreman?.lastName}{" "}
                      {returnTransfer.fromObject.foreman?.firstName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{returnTransfer.fromObject.name}</span>
                  </div>
                </div>
                <div className="flex items-center mt-5">
                  <Minus />
                  <MoveRight />
                </div>
                <div className="flex flex-col gap-2 mt-5">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>
                      {returnTransfer.toObject.foreman?.lastName}{" "}
                      {returnTransfer.toObject.foreman?.firstName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{returnTransfer.toObject.name}</span>
                  </div>
                </div>
              </div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs border-orange-400">
            Требуется подтверждение
          </Badge>
          <span className="text-xs">Нажмите для просмотра</span>
        </div>
      </CardContent>
    </Card>
  );
}
