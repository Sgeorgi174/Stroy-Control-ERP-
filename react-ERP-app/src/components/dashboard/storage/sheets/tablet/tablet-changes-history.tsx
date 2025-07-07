import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/format-date";
import { ArrowRight, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { TabletHistoryRecord } from "@/types/tabletHistoryRecord";
import { CommentPopover } from "../../comment-popover";
import { tabletStatusMap } from "@/constants/tabletStatusMap";

type TabletHistoryProps = {
  historyRecords: TabletHistoryRecord[];
  isError: boolean;
  isLoading: boolean;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "ON_OBJECT":
    case "ACTIVE":
      return "bg-green-100 text-green-800";
    case "IN_TRANSIT":
      return "bg-blue-100 text-blue-800";
    case "IN_REPAIR":
    case "INACTIVE":
      return "bg-yellow-100 text-yellow-800";
    case "LOST":
    case "WRITTEN_OFF":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function TabletHistory({
  historyRecords,
  isError,
  isLoading,
}: TabletHistoryProps) {
  return (
    <div className="mt-4">
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
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-4 w-6" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-sm text-destructive">
          Ошибка загрузки истории статусов.
        </div>
      ) : historyRecords.length === 0 ? (
        <div className="text-sm text-muted-foreground">История пуста.</div>
      ) : (
        <div className="space-y-3">
          {historyRecords.map((history) => (
            <div
              key={history.id}
              className="flex items-center gap-3 p-3 pr-[50px] bg-muted rounded-lg border shadow"
            >
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-purple-600" />
              </div>

              <div className="flex-1">
                <div className="text-sm font-medium mb-1">
                  {history.fromStatus && history.toStatus
                    ? "Смена статуса"
                    : "Смена пользователя"}
                </div>
                {history.toEmployee && (
                  <div className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                    {history.fromEmployee
                      ? `${history.fromEmployee.lastName} ${history.fromEmployee.firstName}`
                      : "Был свободен"}{" "}
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    {history.toEmployee.firstName} {history.toEmployee.lastName}
                  </div>
                )}
                {history.fromStatus && history.toStatus && (
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getStatusColor(history.fromStatus)}>
                      {tabletStatusMap[history.fromStatus]}
                    </Badge>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    <Badge className={getStatusColor(history.toStatus)}>
                      {tabletStatusMap[history.toStatus]}
                    </Badge>
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  {formatDate(history.createdAt)} {history.changedBy.firstName}{" "}
                  {history.changedBy.lastName}
                </div>
              </div>
              <CommentPopover comment={history.comment} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
