import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { PendingToolTransfer } from "@/types/transfers";
import { Building, Package, Phone, User } from "lucide-react";

type ToolTransferDetailsProps = {
  toolTransfer: PendingToolTransfer;
};

export function ToolTransferDetails({
  toolTransfer,
}: ToolTransferDetailsProps) {
  console.log(toolTransfer);

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
            <p className="text-sm text-gray-500">Инструмент</p>
            <p className="font-medium">{toolTransfer.tool.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Серийный номер</p>
            <p className="font-mono text-sm">
              {toolTransfer.tool.serialNumber}
            </p>
          </div>
        </div>

        <Separator />

        <div>
          <p className="text-sm text-gray-500 mb-2">Текущее место хранения</p>
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Building className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">
                {toolTransfer.fromObject.name}
              </span>
            </div>
            {toolTransfer.fromObject.foreman && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>
                    {toolTransfer.fromObject.foreman.lastName}{" "}
                    {toolTransfer.fromObject.foreman.firstName}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{toolTransfer.fromObject.foreman.phone}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
