import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime } from "@/lib/utils/format-date";
import type { ClothesActions, TransferRecord } from "@/types/historyRecords";
import {
  Calendar,
  Clock,
  Package,
  TrendingDown,
  TrendingUp,
  User,
} from "lucide-react";
import { CommentPopover } from "../../comment-popover";
import { Skeleton } from "@/components/ui/skeleton";

type ClothesHistoryProps = {
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
  RETURN_FROM_EMPLOYEE: "Возврат от сотрудника",
};

const getActionIcon = (action: ClothesActions) => {
  switch (action) {
    case "ADD":
    case "CONFIRM":
    case "CANCEL":
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    case "GIVE_TO_EMPLOYEE":
    case "TRANSFER":
    case "WRITTEN_OFF":
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    default:
      return <Package className="w-4 h-4 text-blue-600" />;
  }
};

export function ClothesHistory({
  transferRecords,
  isError,
  isLoading,
}: ClothesHistoryProps) {
  console.log(transferRecords);

  return (
    <div className="space-y-6 mt-4">
      <div>
        <h3 className="font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <Package className="w-4 h-4" />
          Перемещения и количество
        </h3>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="p-3 bg-muted rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-4 w-6" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-sm text-destructive">
            Ошибка загрузки истории одежды.
          </div>
        ) : transferRecords.length === 0 ? (
          <div className="text-sm text-muted-foreground">История пуста.</div>
        ) : (
          <div className="space-y-3">
            {transferRecords.map((history) => (
              <div
                key={history.id}
                className="flex items-center gap-3 p-3 bg-muted rounded-lg"
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  {getActionIcon(history.action)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {actionMap[history.action]}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      Кол-во: {history.quantity}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {(history.action === "TRANSFER" ||
                      history.action === "CONFIRM" ||
                      history.action === "CANCEL") && (
                      <div>
                        {history.fromObject.name} → {history.toObject.name}
                      </div>
                    )}
                    {history.action === "GIVE_TO_EMPLOYEE" && (
                      <div>
                        {history.fromObject.name} →{" "}
                        {history.toEmployee.lastName}{" "}
                        {history.toEmployee.firstName}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground flex gap-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(history.createdAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(history.createdAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {history.movedBy.firstName} {history.movedBy.lastName}
                    </div>
                  </div>
                </div>
                {(history.action === "WRITTEN_OFF" ||
                  history.action === "RETURN_FROM_EMPLOYEE") && (
                  <CommentPopover comment={history.writeOffComment} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
