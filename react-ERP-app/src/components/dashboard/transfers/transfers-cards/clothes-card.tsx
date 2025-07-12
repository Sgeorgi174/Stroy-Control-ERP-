import { Badge } from "@/components/ui/badge";
import { BootIcon } from "@/components/ui/boot";
import { Card, CardContent } from "@/components/ui/card";
import { transferStatusMap } from "@/constants/transfer-status-map";
import { formatDate, formatTime } from "@/lib/utils/format-date";
import { getColorBorder } from "@/lib/utils/gerColorBadge";
import {
  getStatusColor,
  getStatusIcon,
} from "@/lib/utils/IconAndColorTransferBadge";
import { useTransferSheetStore } from "@/stores/transfer-sheet-store";
import type { PendingClothesTransfer } from "@/types/transfers";
import {
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Minus,
  Shirt,
} from "lucide-react";

type TransferClothesCardProps = {
  transferClothes: PendingClothesTransfer[];
};

export function TransferClothesCard({
  transferClothes,
}: TransferClothesCardProps) {
  const { openSheet } = useTransferSheetStore();
  return (
    <>
      {transferClothes.map((transfer) => (
        <Card
          key={transfer.id}
          onClick={() => openSheet("clothes", transfer)}
          className={`p-2 bg-sidebar-accent hover:shadow-primary border-l-4 cursor-pointer border-b-4 ${getColorBorder(
            transfer.status
          )}`}
        >
          <CardContent className="p-4">
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Tool & Serial */}
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                  {transfer.clothes.type === "FOOTWEAR" ? (
                    <BootIcon className="w-6 h-6 text-primary" />
                  ) : (
                    <Shirt className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-primary truncate">
                    {transfer.clothes.name}
                  </p>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground font-mono">
                      Размер: {transfer.clothes.size}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      Сезон:{" "}
                      {transfer.clothes.season === "SUMMER" ? "Лето" : "Зима"}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      Кол-во: {transfer.quantity}
                    </p>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="col-span-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {formatDate(transfer.updatedAt)}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatTime(transfer.updatedAt)}
                </div>
              </div>

              {/* Transfer Route */}
              <div className="col-span-5 flex gap-3 items-center">
                <div className="flex items-center gap-1 min-w-0">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-sm text-primary truncate">
                    {transfer.fromObject.name}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Minus className="w-3 h-3 text-muted-foreground" />
                  <Minus className="w-3 h-3 text-muted-foreground" />
                  <Minus className="w-3 h-3 text-muted-foreground" />
                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-1 min-w-0 flex-1">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-sm text-primary truncate">
                    {transfer.toObject.name}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="w-full flex  flex-col  justify-center gap-2">
                <div className="flex  items-center gap-2">
                  <Badge
                    className={`${getStatusColor(
                      transfer.status
                    )} flex items-center gap-1`}
                  >
                    {getStatusIcon(transfer.status)}
                    {transferStatusMap[transfer.status]}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
