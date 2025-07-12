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
import { Textarea } from "@/components/ui/textarea";

interface CancelTransferDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTransfer:
    | PendingToolTransfer
    | PendingClothesTransfer
    | PendingDeviceTransfer;
  type: "tool" | "clothes" | "device" | null;
  handleCancel: (transferId: string) => void;
  comment: string;
  setComment: (comment: string) => void;
}

export default function CancelTransferDialog({
  isOpen,
  onOpenChange,
  type,
  selectedTransfer,
  handleCancel,
  comment,
  setComment,
}: CancelTransferDialogProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Отменить перемещение
          </DialogTitle>
          <DialogDescription className="text-transparent w-0 h-0">
            Подтвердите отмену перемещения
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-800">
              <strong>Что произойдет:</strong>
            </p>
            <ul className="text-sm text-orange-700 mt-2 space-y-1">
              <li>• Статус перемещения изменится на "Отменено"</li>
              <li>• Инвентарь останется на исходном объекте</li>
            </ul>
          </div>
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
        <div className="space-y-2">
          <Label htmlFor="writeoff-comment">
            Причина отмены <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="writeoff-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Укажите подробную причину отмены (например: случайное перемещение, не тот инвентарь, повреждение и т.д.)"
            className="min-h-[100px] resize-none"
            maxLength={500}
          />
        </div>
        {/* ✅ Чекбокс */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="confirm-return"
            checked={isConfirmed}
            onCheckedChange={(val) => setIsConfirmed(!!val)}
          />
          <Label htmlFor="confirm-return" className="text-sm">
            Я подтверждаю отмену перемещения.
          </Label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button
            onClick={() => handleCancel(selectedTransfer.id)}
            disabled={!isConfirmed || !comment}
          >
            Отменить перемещение
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
