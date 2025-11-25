import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { PendingDeviceTransfer } from "@/types/transfers";
import { Building, Package, Phone, User } from "lucide-react";

type DeviceTransferDetailsProps = {
  deviceTransfer: PendingDeviceTransfer;
};

export function DeviceTransferDetails({
  deviceTransfer,
}: DeviceTransferDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Package className="w-5 h-5" />
          Tool Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Устройство</p>
            <p className="font-medium">{deviceTransfer.device.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Инвентарный номер</p>
            <p className="font-medium">{deviceTransfer.device.serialNumber}</p>
          </div>
        </div>

        <Separator />

        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Текущее место хранения
          </p>
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Building className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">
                {deviceTransfer.status !== "CONFIRM"
                  ? deviceTransfer.fromObject.name
                  : deviceTransfer.toObject.name}
              </span>
            </div>
            {deviceTransfer.fromObject.foreman &&
              deviceTransfer.toObject.foreman && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>
                      {deviceTransfer.status !== "CONFIRM"
                        ? `${deviceTransfer.fromObject.foreman.lastName} ${deviceTransfer.fromObject.foreman.firstName}`
                        : `${deviceTransfer.toObject.foreman.lastName} ${deviceTransfer.toObject.foreman.firstName}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>
                      {deviceTransfer.status !== "CONFIRM"
                        ? deviceTransfer.fromObject.foreman.phone
                        : deviceTransfer.toObject.foreman.phone}
                    </span>
                  </div>
                </div>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
