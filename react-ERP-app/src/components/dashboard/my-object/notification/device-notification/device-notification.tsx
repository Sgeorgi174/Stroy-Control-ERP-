import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import type { PendingDeviceTransfer } from "@/types/transfers";
import { useState } from "react";
import { DeviceNotificationCard } from "./device-notification-card";
import { DeviceTransferDialog } from "./device-transfer-dialog";

type DevieNotificationProp = {
  deviceTransfer: PendingDeviceTransfer;
};

export function DeviceNotification({ deviceTransfer }: DevieNotificationProp) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <DeviceNotificationCard
          deviceTransfer={deviceTransfer}
          onClick={() => setIsDialogOpen(true)}
        />
      </DialogTrigger>

      <DeviceTransferDialog
        deviceTransfer={deviceTransfer}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </Dialog>
  );
}
