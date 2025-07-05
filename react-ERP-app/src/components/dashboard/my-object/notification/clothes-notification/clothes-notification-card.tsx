import { Package, User, MapPin, MoveRight, Minus } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PendingClothesTransfer } from "@/types/transfers";

type ClothesNotificationCardProps = {
  clothesTransfer: PendingClothesTransfer;
  onClick: () => void;
};

export function ClothesNotificationCard({
  clothesTransfer,
  onClick,
}: ClothesNotificationCardProps) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-primary transition-shadow duration-200 border-l-4 gap-2 border-l-violet-500"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center">
            <Package className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-medium leading-tight">
              Новое перемещение
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              <span>{clothesTransfer.clothes.name}, в пути на ваш объект</span>

              <div className="flex gap-4">
                <div className="flex flex-col gap-2 mt-5">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>
                      {clothesTransfer.fromObject.foreman?.lastName}{" "}
                      {clothesTransfer.fromObject.foreman?.firstName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{clothesTransfer.fromObject.name}</span>
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
                      {clothesTransfer.toObject.foreman?.lastName}{" "}
                      {clothesTransfer.toObject.foreman?.firstName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{clothesTransfer.toObject.name}</span>
                  </div>
                </div>
              </div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            Требуется подтверждение
          </Badge>
          <span className="text-xs">Нажмите для просмотра</span>
        </div>
      </CardContent>
    </Card>
  );
}
