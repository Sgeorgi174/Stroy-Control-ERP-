import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type {
  PendingClothesTransfer,
  PendingDeviceTransfer,
  PendingToolTransfer,
} from "@/types/transfers";
import { AlertTriangle, ArrowLeft, Building } from "lucide-react";
import { ToolInfo } from "../tool-notification/tool-notifation-info";
import { DeviceInfo } from "../device-notification/device-info";
import { ClothesInfo } from "../clothes-notification/clothes-info";
import { photoUrl } from "@/constants/baseUrl";
import { useState } from "react";
import { ConfirmCheckbox } from "../notification-confirm-checkbox";
import { useConfirmToolTransfer } from "@/hooks/tool/useConfirmToolTransfer";
import { useConfirmDeviceTransfer } from "@/hooks/device/useConfirmDeviceTransfer";
import { useConfirmClothesTransfer } from "@/hooks/clothes/useClothes";

type ToolTransferDialogProps = {
  returnTransfer:
    | PendingToolTransfer
    | PendingClothesTransfer
    | PendingDeviceTransfer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "clothes" | "device" | "tool";
};

export function ReturnNotificationDialog({
  returnTransfer,
  onOpenChange,
  type,
}: ToolTransferDialogProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const toolReturn = returnTransfer as PendingToolTransfer;
  const deviceReturn = returnTransfer as PendingDeviceTransfer;
  const clothesReturn = returnTransfer as PendingClothesTransfer;

  const confirmTool = useConfirmToolTransfer();
  const confirmDevice = useConfirmDeviceTransfer();
  const confirmClothes = useConfirmClothesTransfer(returnTransfer.id);

  // Подтверждение перемещения
  const handleConfirm = () => {
    if (type === "tool") {
      confirmTool.mutate(toolReturn.id, {
        onSuccess: () => onOpenChange(false),
      });
    }

    if (type === "device") {
      confirmDevice.mutate(deviceReturn.id, {
        onSuccess: () => onOpenChange(false),
      });
    }

    if (type === "clothes") {
      confirmClothes.mutate(
        { quantity: clothesReturn.quantity },
        {
          onSuccess: () => onOpenChange(false),
        }
      );
    }
  };

  return (
    <DialogContent className="max-w-3xl min-w-[500px] max-h-[80vh] overflow-auto flex flex-col">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <ArrowLeft className="w-5 h-5 text-orange-500" />
          Уведомление о возврате
        </DialogTitle>
        <DialogDescription>
          Ознакомтесь с деталями и примите возврат.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-10 p-3 rounded-lg bg-muted">
          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground">
              Возвращен с объекта:
            </p>
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              <p className=" text-sm font-medium">
                {returnTransfer.fromObject.name}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground">Обратно на объект:</p>
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              <p className=" text-sm font-medium">
                {returnTransfer.toObject.name}
              </p>
            </div>
          </div>
        </div>
        <div>
          {type === "tool" && <ToolInfo tool={toolReturn.tool} />}
          {type === "device" && <DeviceInfo device={deviceReturn.device} />}
          {type === "clothes" && (
            <ClothesInfo clothesTransfer={clothesReturn} />
          )}
        </div>

        {returnTransfer.rejectionComment && (
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-orange-900 mb-2">
                  Причина возврата
                </h4>
                <p className="text-sm text-orange-800 leading-relaxed">
                  {returnTransfer.rejectionComment}
                </p>
              </div>
            </div>
          </div>
        )}

        {returnTransfer.photoUrl && (
          <div>
            <h4 className="font-medium mb-3">Фото, подтверждающее возврат</h4>
            <div className="bg-muted p-1 rounded-lg">
              <img
                src={`${photoUrl}${returnTransfer.photoUrl}`}
                alt="Фото возврата"
                className="max-w-full h-auto rounded-md shadow-sm"
              />
            </div>
          </div>
        )}
      </div>

      <ConfirmCheckbox checked={isConfirmed} onChange={setIsConfirmed} />

      <DialogFooter>
        <>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Отмена
          </Button>
          <Button
            disabled={
              !isConfirmed ||
              confirmTool.isPending ||
              confirmDevice.isPending ||
              confirmClothes.isPending
            }
            onClick={handleConfirm}
          >
            Принять
          </Button>
        </>
      </DialogFooter>
    </DialogContent>
  );
}
