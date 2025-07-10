import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { baseUrl } from "@/constants/baseUrl";
import type {
  PendingClothesTransfer,
  PendingDeviceTransfer,
  PendingToolTransfer,
} from "@/types/transfers";
import { AlertTriangle, ArrowLeft, RotateCcw, Trash2 } from "lucide-react";

type TransferRejectProps = {
  selectedTransfer:
    | PendingToolTransfer
    | PendingClothesTransfer
    | PendingDeviceTransfer;
  handleRetransfer: () => void;
  handleWriteOff: () => void;
  handleReturn: () => void;
};

export function TransferReject({
  selectedTransfer,
  handleRetransfer,
  handleWriteOff,
  handleReturn,
}: TransferRejectProps) {
  return (
    <Card className="border-red-400">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-destructive">
          <AlertTriangle className="w-5 h-5" />
          Детали отказа
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedTransfer.rejectionComment && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Причина отказа</p>
            <div className=" p-3 rounded-lg border border-muted-foreground">
              <p className="text-sm">{selectedTransfer.rejectionComment}</p>
            </div>
          </div>
        )}

        {selectedTransfer.photoUrl && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Фото</p>
            <div className="bg-muted p-4 rounded-lg">
              <img
                src={
                  `${baseUrl}${selectedTransfer.photoUrl}` || "/placeholder.svg"
                }
                alt="Rejection evidence"
                className="max-w-full h-auto rounded-md"
              />
            </div>
          </div>
        )}

        <Separator />

        <div className="space-y-3">
          <p className="font-medium text-gray-900">Возможные Решения</p>
          <div className="grid gap-2">
            <Button onClick={handleRetransfer} className="w-full justify-start">
              <RotateCcw className="w-4 h-4 mr-2" />
              Перемещение
            </Button>
            <Button
              onClick={handleWriteOff}
              variant="destructive"
              className="w-full justify-start"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Списать
            </Button>
            <Button
              onClick={handleReturn}
              variant="outline"
              className="w-full justify-start"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуть на объект отправитель
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
