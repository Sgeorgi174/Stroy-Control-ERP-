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
};

const getActionIcon = (action: ClothesActions) => {
  switch (action) {
    case "ADD":
    case "CONFIRM":
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    case "GIVE_TO_EMPLOYEE":
    case "TRANSFER":
    case "WRITTEN_OFF":
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    default:
      return <Package className="w-4 h-4 text-blue-600" />;
  }
};

export function ClothesHistory({ transferRecords }: ClothesHistoryProps) {
  return (
    <div className="space-y-6 mt-4">
      {/* Movement History */}
      <div>
        <h3 className="font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <Package className="w-4 h-4" />
          Перемещения и количество
        </h3>
        <div className="space-y-3">
          {transferRecords.map((history) => (
            <div
              key={history.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
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
                <div className="text-sm text-gray-600">
                  {(history.action === "TRANSFER" ||
                    history.action === "CONFIRM") && (
                    <div>
                      {history.fromObject.name} → {history.toObject.name}
                    </div>
                  )}
                  {history.action === "GIVE_TO_EMPLOYEE" && (
                    <div>
                      {`${history.fromObject.name}`} →{" "}
                      {`${history.toEmployee.lastName} ${history.toEmployee.firstName}`}
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground flex gap-2">
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
              {history.action === "WRITTEN_OFF" && (
                <CommentPopover comment={history.writeOffComment} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
