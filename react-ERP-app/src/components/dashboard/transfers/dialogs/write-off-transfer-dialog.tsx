import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type {
  PendingClothesTransfer,
  PendingDeviceTransfer,
  PendingToolTransfer,
} from "@/types/transfers";
import { TranferDetailsCardDialog } from "./transfer-details-dialog";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface WriteOffTransferDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTransfer:
    | PendingToolTransfer
    | PendingClothesTransfer
    | PendingDeviceTransfer;
  type: "tool" | "clothes" | "device" | null;
  comment: string;
  setComment: (comment: string) => void;
  handleWriteOff: () => void;
}

export default function WriteOffTransferDialog({
  isOpen,
  onOpenChange,
  type,
  comment,
  setComment,
  selectedTransfer,
  handleWriteOff,
}: WriteOffTransferDialogProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "tool" && "Списать инструмент"}
            {type === "device" && "Списать устройство"}
            {type === "clothes" && `Списать спецодежду`}
          </DialogTitle>
          <DialogDescription className="text-transparent w-0 h-0">
            Укажите причину списания
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800 mb-1">
                  Внимание! Это действие нельзя отменить
                </p>
                <p className="text-sm text-red-700">
                  {type === "tool" &&
                    "Инструмент будет помечен как списанный и удален из активного инвентаря."}
                  {type === "device" &&
                    "Устройство будет помечено как списанное и удалено из активного инвентаря."}
                  {type === "clothes" &&
                    `Спецодежда будет списана и удалена из общего количества на объекте "${selectedTransfer.fromObject.name}".`}
                </p>
              </div>
            </div>
          </div>

          <TranferDetailsCardDialog
            selectedTransfer={selectedTransfer}
            type={type}
          />

          <div className="space-y-2 mt-8">
            <Label htmlFor="writeoff-comment">
              Причина списания <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="writeoff-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Укажите подробную причину списания (например: поломка, износ, утеря, повреждение и т.д.)"
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
          </div>
        </div>

        {/* ✅ Чекбокс подтверждения */}
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="confirm-writeoff"
            checked={isConfirmed}
            onCheckedChange={(val) => setIsConfirmed(!!val)}
          />
          <Label htmlFor="confirm-writeoff" className="text-sm">
            Я подтверждаю списание.
          </Label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button
            variant="destructive"
            onClick={handleWriteOff}
            disabled={!comment.trim() || !isConfirmed}
          >
            Списать
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
