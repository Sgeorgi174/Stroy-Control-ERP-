import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  PendingClothesTransfer,
  PendingDeviceTransfer,
  PendingToolTransfer,
} from "@/types/transfers";
import { Package, XCircle } from "lucide-react";

type TransferInTransitProps = {
  handleCancel: () => void;
  selectedTransfer:
    | PendingClothesTransfer
    | PendingDeviceTransfer
    | PendingToolTransfer;
};

export function TransferInTransit({
  handleCancel,
  selectedTransfer,
}: TransferInTransitProps) {
  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
          <Package className="w-5 h-5" />
          Перемещение в пути
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
          <p className="text-sm text-blue-800">Перемещение в процессе.</p>
        </div>
        {selectedTransfer.rejectMode !== "RETURN_TO_SOURCE" && (
          <Button
            variant="destructive"
            onClick={handleCancel}
            className="w-full mt-4"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Отменить перемещение
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
