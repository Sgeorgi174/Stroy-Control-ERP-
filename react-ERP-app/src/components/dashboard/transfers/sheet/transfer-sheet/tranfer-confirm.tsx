import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  PendingClothesTransfer,
  PendingDeviceTransfer,
  PendingToolTransfer,
} from "@/types/transfers";
import { CheckCircle } from "lucide-react";

type TransferConfirmProps = {
  selectedTransfer:
    | PendingToolTransfer
    | PendingClothesTransfer
    | PendingDeviceTransfer;
};

export function TransferConfirm({ selectedTransfer }: TransferConfirmProps) {
  return (
    <Card className="border-green-200">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-green-700">
          <CheckCircle className="w-5 h-5" />
          Перемещение выполнено
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-800">
            Перемещение успешно выполнено. Инвентарь был перемещен на объект{" "}
            {selectedTransfer.toObject.name} и принят мастером.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
