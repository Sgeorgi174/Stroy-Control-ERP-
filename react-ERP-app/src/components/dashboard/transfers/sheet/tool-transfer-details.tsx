import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PendingToolTransfer } from "@/types/transfers";
import { Package } from "lucide-react";

type ToolTransferDetailsProps = {
  toolTransfer: PendingToolTransfer;
};

export function ToolTransferDetails({
  toolTransfer,
}: ToolTransferDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Package className="w-5 h-5" />
          Информация об инструменте
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Инструмент</p>
            <p className="font-medium">{toolTransfer.tool.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {toolTransfer.tool.isBulk ? "Количество" : "Инвентарный номер"}
            </p>
            {!toolTransfer.tool.isBulk && (
              <p className="font-medium">{toolTransfer.tool.serialNumber}</p>
            )}
            {toolTransfer.tool.isBulk && (
              <p className="font-medium">{toolTransfer.quantity}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
