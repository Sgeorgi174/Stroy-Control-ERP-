import { Badge } from "@/components/ui/badge";
import { statusMap } from "@/constants/statusMap";
import { formatDate, formatTime } from "@/lib/utils/format-date";
import type { StatusChangesRecord } from "@/types/historyRecords";
import { ArrowRight, Calendar, Clock, SquarePen } from "lucide-react";
import { CommentPopover } from "../../tables/status-changes-table/comment-popover";
import { Skeleton } from "@/components/ui/skeleton";

type ToolsStatusHistoryProps = {
  statusChangesRecords: StatusChangesRecord[];
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

export function ToolsStatusHistory({
  statusChangesRecords,
  isError,
  isLoading,
}: ToolsStatusHistoryProps) {
  return (
    <div className="mt-4">
      <h3 className="font-medium text-muted-foreground mb-3 flex items-center gap-2">
        <SquarePen className="w-4 h-4" />
        Смена статуса
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
      ) : statusChangesRecords.length === 0 ? (
        <div className="text-sm text-muted-foreground">История пуста.</div>
      ) : (
        <div className="space-y-3">
          {statusChangesRecords.map((status) => (
            <div
              key={status.id}
              className="flex items-center justify-between p-3 pr-[50px] bg-muted rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <SquarePen className="w-4 h-4 text-orange-600" />
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="flex gap-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <p>{formatDate(status.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <p>{formatTime(status.createdAt)}</p>
                      </div>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getStatusColor(status.fromStatus)}>
                      {statusMap[status.fromStatus].label}
                    </Badge>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    <Badge className={getStatusColor(status.toStatus)}>
                      {statusMap[status.toStatus].label}
                    </Badge>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Кто: {status.changedBy.firstName}{" "}
                    {status.changedBy.lastName}
                  </div>
                </div>
              </div>

              <CommentPopover comment={status.comment} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
