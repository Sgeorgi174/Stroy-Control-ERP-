import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type {
  PendingClothesTransfer,
  PendingDeviceTransfer,
  PendingToolTransfer,
} from "@/types/transfers";
import { Info } from "lucide-react";

type TransferCancelProps = {
  selectedTransfer:
    | PendingToolTransfer
    | PendingClothesTransfer
    | PendingDeviceTransfer;
};

export function TransferCancel({ selectedTransfer }: TransferCancelProps) {
  return (
    <Card className="border-orange-400">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-orange-400">
          <Info className="w-5 h-5" />
          Детали отмены
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedTransfer.rejectionComment && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Причина отмены</p>
            <div className=" p-3 rounded-lg border border-muted-foreground">
              <p className="text-sm">{selectedTransfer.rejectionComment}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
