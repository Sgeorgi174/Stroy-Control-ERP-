import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime } from "@/lib/utils/format-date";
import type { TransferRecord } from "@/types/historyRecords";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";

type ToolTransferHistoryProps = {
  transferRecords: TransferRecord[];
  isError: boolean;
  isLoading: boolean;
};

export function ToolTransferHistory({
  transferRecords,
}: ToolTransferHistoryProps) {
  return (
    <div className="space-y-6 mt-4">
      {/* Movement History */}
      <div>
        <h3 className="font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Перемещения
        </h3>
        <div className="space-y-3">
          {transferRecords.map((history) => (
            <div
              key={history.id}
              className="flex items-center gap-3 p-3 bg-muted rounded-lg"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-blue-600" />
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
                <div className="text-sm flex items-center gap-2 ">
                  {history.fromObject?.name}{" "}
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
      </div>
    </div>
  );
}
