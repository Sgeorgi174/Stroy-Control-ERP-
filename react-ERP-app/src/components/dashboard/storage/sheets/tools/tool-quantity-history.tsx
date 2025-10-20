import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatTime } from "@/lib/utils/format-date";
import type { ClothesActions, TransferRecord } from "@/types/historyRecords";
import {
  Calendar,
  Clock,
  MapPin,
  Package,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { CommentPopover } from "../../comment-popover";

type ToolTransferHistoryProps = {
  transferRecords: TransferRecord[];
  isError: boolean;
  isLoading: boolean;
};

const actionMap = {
  ADD: "Пополнение",
  TRANSFER: "Перемещение",
  CONFIRM: "Приняли на объекте",
  GIVE_TO_EMPLOYEE: "Выдача сотруднику",
  WRITTEN_OFF: "Списание",
  CANCEL: "Отмена перемещения",
};

const getActionIcon = (action: ClothesActions) => {
  switch (action) {
    case "ADD":
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    case "WRITTEN_OFF":
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    default:
      return <Package className="w-4 h-4 text-blue-600" />;
  }
};

export function ToolQuantityHistory({
  transferRecords,
  isLoading,
  isError,
}: ToolTransferHistoryProps) {
  console.log(transferRecords);

  return (
    <div className="mt-4 space-y-6">
      <div>
        <h3 className="font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Списания и пополнения
        </h3>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="p-3 bg-muted rounded-lg flex items-center gap-3"
              >
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="space-y-2 w-full">
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-sm text-destructive">
            Ошибка загрузки истории перемещений.
          </div>
        ) : transferRecords.length === 0 ? (
          <div className="text-sm text-muted-foreground">История пуста.</div>
        ) : (
          <div className="space-y-3">
            {transferRecords.map((history) => (
              <div
                key={history.id}
                className="flex items-center gap-3 p-3 bg-muted rounded-lg border shadow"
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  {getActionIcon(history.action)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="flex gap-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <p>{formatDate(history.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <p>{formatTime(history.createdAt)}</p>
                      </div>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {actionMap[history.action]}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      Кол-во: {history.quantity}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Кто: {history.movedBy.firstName} {history.movedBy.lastName}
                  </div>
                </div>
                {history.action === "WRITTEN_OFF" && (
                  <CommentPopover comment={history.comment} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
