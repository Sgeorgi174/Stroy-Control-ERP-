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
            <p className="text-sm text-gray-500">Устройство</p>
            <p className="font-medium">{deviceTransfer.device.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Серийный номер</p>
            <p className="font-mono text-sm">
              {deviceTransfer.device.serialNumber}
            </p>
          </div>
        </div>

        <Separator />

        <div>
          <p className="text-sm text-gray-500 mb-2">Текущее место хранения</p>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Building className="w-4 h-4 text-gray-600" />
              <span className="font-medium">
                {deviceTransfer.fromObject.name}
              </span>
            </div>
            {deviceTransfer.fromObject.foreman && (
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>
                    {deviceTransfer.fromObject.foreman.lastName}{" "}
                    {deviceTransfer.fromObject.foreman.firstName}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{deviceTransfer.fromObject.foreman.phone}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
