import type { PendingToolTransfer } from "@/types/transfers";
import { Wrench } from "lucide-react";

type ToolInfoProps = {
  tool: PendingToolTransfer["tool"];
};

export function ToolInfo({ tool }: ToolInfoProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
      <div className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center">
        <Wrench className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium text-sm">{tool.name}</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="font-mono">Серийный номер: {tool.serialNumber}</span>
        </div>
      </div>
    </div>
  );
}
