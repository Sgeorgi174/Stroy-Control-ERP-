import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime } from "@/lib/utils/format-date";
import type { TransferRecord } from "@/types/historyRecords";
import { ArrowRight, Calendar, Clock, MapPin, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

type DeviceTransferHistoryProps = {
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
  RETURN_TO_SOURCE: "Возврат",
};

export function DeviceTransferHistory({
  transferRecords,
  isError,
  isLoading,
}: DeviceTransferHistoryProps) {
  const sortedRecords = useMemo(() => {
    return [...transferRecords].sort((a, b) => {
      const timeDiff =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

      if (timeDiff !== 0) return timeDiff;

      return a.id.localeCompare(b.id);
    });
  }, [transferRecords]);

  return (
    <div className="mt-4 space-y-6">
      <div>
        <h3 className="font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Перемещения
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
        ) : sortedRecords.length === 0 ? (
          <div className="text-sm text-muted-foreground">История пуста.</div>
        ) : (
          <div className="space-y-3">
            {sortedRecords.map((history) => (
              <div
                key={history.id}
                className="flex items-center gap-3 p-3 bg-muted rounded-lg border shadow"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  {history.action !== "CANCEL" && (
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                  )}
                  {history.action === "CANCEL" && (
                    <X className="w-4 h-4 text-blue-600" />
                  )}
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
                      <div>
                        <p>{actionMap[history.action]}</p>
                      </div>
                    </Badge>
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    {history.fromObject?.name ?? "—"}{" "}
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />{" "}
                    {history.toObject.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Кто: {history.movedBy.firstName} {history.movedBy.lastName}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
