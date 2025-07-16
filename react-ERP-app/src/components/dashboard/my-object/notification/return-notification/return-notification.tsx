type ToolNotificationProp = {
  returnTransfer:
    | PendingToolTransfer
    | PendingClothesTransfer
    | PendingDeviceTransfer;
  type: "clothes" | "device" | "tool";
};

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import type {
  PendingClothesTransfer,
  PendingDeviceTransfer,
  PendingToolTransfer,
} from "@/types/transfers";
import { useState } from "react";
import { ReturnNotificationCard } from "./return-notification-card";
import { ReturnNotificationDialog } from "./return-notification-dialog";

export function ReturnNotification({
  returnTransfer,
  type,
}: ToolNotificationProp) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <ReturnNotificationCard
          returnTransfer={returnTransfer}
          type={type}
          onClick={() => setIsDialogOpen(true)}
        />
      </DialogTrigger>

      <ReturnNotificationDialog
        returnTransfer={returnTransfer}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        type={type}
      />
    </Dialog>
  );
}
