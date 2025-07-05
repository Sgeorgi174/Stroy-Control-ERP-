import type { PendingDeviceTransfer } from "@/types/transfers";
import { Printer } from "lucide-react";

type ToolInfoProps = {
  device: PendingDeviceTransfer["device"];
};

export function DeviceInfo({ device }: ToolInfoProps) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-muted">
      <div className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center">
        <Printer className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium text-sm">{device.name}</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="font-mono">
            Серийный номер: {device.serialNumber}
          </span>
        </div>
      </div>
    </div>
  );
}
