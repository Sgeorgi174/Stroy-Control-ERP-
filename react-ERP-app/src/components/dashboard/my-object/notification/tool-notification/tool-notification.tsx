type ToolNotificationProp = {
  toolTransfer: PendingToolTransfer;
};

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import type { PendingToolTransfer } from "@/types/transfers";
import { useState } from "react";
import { ToolNotificationCard } from "./tool-notification-card";
import { ToolTransferDialog } from "./tool-transfer-dialog";

export default function ToolNotification({
  toolTransfer,
}: ToolNotificationProp) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <ToolNotificationCard
          toolTransfer={toolTransfer}
          onClick={() => setIsDialogOpen(true)}
        />
      </DialogTrigger>

      <ToolTransferDialog
        toolTransfer={toolTransfer}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </Dialog>
  );
}
