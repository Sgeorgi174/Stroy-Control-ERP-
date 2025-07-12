import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  PendingClothesTransfer,
  PendingDeviceTransfer,
  PendingToolTransfer,
} from "@/types/transfers";
import { TranferDetailsCardDialog } from "./transfer-details-dialog";
import { Building } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface ReturnToSenderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTransfer:
    | PendingToolTransfer
    | PendingClothesTransfer
    | PendingDeviceTransfer;
  type: "tool" | "clothes" | "device" | null;
  handleReturn: () => void;
}

export default function ReturnToSenderDialog({
  isOpen,
  onOpenChange,
  type,
  selectedTransfer,
  handleReturn,
}: ReturnToSenderDialogProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Вернуть отправителю
          </DialogTitle>
          <DialogDescription className="text-transparent w-0 h-0">
            Подтвердите возврат инвентаря на исходный объект
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <TranferDetailsCardDialog
              selectedTransfer={selectedTransfer}
              type={type}
            />

            <div className="flex  items-center gap-4 p-3 rounded-lg bg-muted border shadow">
              <div className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center">
                <Building className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm">
                    {selectedTransfer.fromObject.name}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="font-mono">
                    {selectedTransfer.fromObject.address}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Чекбокс */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="confirm-return"
            checked={isConfirmed}
            onCheckedChange={(val) => setIsConfirmed(!!val)}
          />
          <Label htmlFor="confirm-return" className="text-sm">
            Я подтверждаю возврат инвентаря.
          </Label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleReturn} disabled={!isConfirmed}>
            Вернуть отправителю
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
