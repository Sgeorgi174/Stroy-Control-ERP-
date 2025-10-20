import { BootIcon } from "@/components/ui/boot";
import type {
  PendingClothesTransfer,
  PendingDeviceTransfer,
  PendingToolTransfer,
} from "@/types/transfers";
import { Printer, Shirt, Wrench } from "lucide-react";

type TranferDetailsDialogProps = {
  selectedTransfer:
    | PendingToolTransfer
    | PendingClothesTransfer
    | PendingDeviceTransfer;
  type: "tool" | "clothes" | "device" | null;
};

export function TranferDetailsCardDialog({
  selectedTransfer,
  type,
}: TranferDetailsDialogProps) {
  if (type === "tool") {
    const toolTransfer = selectedTransfer as PendingToolTransfer;

    return (
      <div className="flex items-center gap-4 p-3 rounded-lg bg-muted border shadow">
        <div className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center">
          <Wrench className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium text-sm">{toolTransfer.tool.name}</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="font-mono">
              Серийный номер: {toolTransfer.tool.serialNumber}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (type === "clothes") {
    const clothesTransfer = selectedTransfer as PendingClothesTransfer;

    return (
      <div className="flex justify-between items-center gap-3 p-3 rounded-lg bg-muted border shadow">
        <div className="flex gap-4 items-center">
          <div className="w-8 h-8 rounded-md flex items-center justify-center">
            {clothesTransfer.clothes.type === "CLOTHING" ? (
              <Shirt className="w-6 h-6" />
            ) : (
              <BootIcon className="w-6 h-6" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium text-sm">
                {clothesTransfer.clothes.name}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="font-mono">
                Сезон:{" "}
                {clothesTransfer.clothes.season === "SUMMER" ? "Лето" : "Зима"}
              </span>
              <span className="font-mono">
                Размер:{" "}
                {clothesTransfer.clothes.type === "CLOTHING"
                  ? clothesTransfer.clothes.closthingSize.size
                  : clothesTransfer.clothes.footwearSize.size}
              </span>
              <span className="font-mono">
                Кол-во: {clothesTransfer.quantity}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "device") {
    const deviceTransfer = selectedTransfer as PendingDeviceTransfer;

    return (
      <div className="flex items-center gap-4 p-3 rounded-lg bg-muted border shadow">
        <div className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center">
          <Printer className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium text-sm">{deviceTransfer.device.name}</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="font-mono">
              Серийный номер: {deviceTransfer.device.serialNumber}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
