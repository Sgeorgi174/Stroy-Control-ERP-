import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import type { PendingClothesTransfer } from "@/types/transfers";
import { useState } from "react";
import { ClothesNotificationCard } from "./clothes-notification-card";
import { ClothesTransferDialog } from "./clothes-transfer-dialog";

type ClothesNotificationProp = {
  clothesTransfer: PendingClothesTransfer;
};

export function ClothesNotification({
  clothesTransfer,
}: ClothesNotificationProp) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <ClothesNotificationCard
          clothesTransfer={clothesTransfer}
          onClick={() => setIsDialogOpen(true)}
        />
      </DialogTrigger>

      <ClothesTransferDialog
        clothesTransfer={clothesTransfer}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </Dialog>
  );
}
