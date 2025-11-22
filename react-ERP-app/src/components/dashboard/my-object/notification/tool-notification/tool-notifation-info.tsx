import type { PendingToolTransfer } from "@/types/transfers";
import { Wrench } from "lucide-react";

type ToolInfoProps = {
  transfer: PendingToolTransfer;
};

export function ToolInfo({ transfer }: ToolInfoProps) {
  console.log(transfer);

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-muted">
      <div className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center">
        <Wrench className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium text-sm">{transfer.tool.name}</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {!transfer.tool.isBulk && (
            <span>Серийный номер: {transfer.tool.serialNumber}</span>
          )}
          {transfer.tool.isBulk && <span>Количество: {transfer.quantity}</span>}
        </div>
      </div>
    </div>
  );
}
