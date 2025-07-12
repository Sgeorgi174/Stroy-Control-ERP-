"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type {
  PendingClothesTransfer,
  PendingDeviceTransfer,
  PendingToolTransfer,
} from "@/types/transfers";
import { useObjects } from "@/hooks/object/useObject";
import type { Object } from "@/types/object";
import { TranferDetailsCardDialog } from "./transfer-details-dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface ResendTransferDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTransfer:
    | PendingToolTransfer
    | PendingClothesTransfer
    | PendingDeviceTransfer;
  type: "tool" | "clothes" | "device" | null;
  handleResend: () => void;
  selectedObjectId: string;
  setSelectedObjectId: (objectId: string) => void;
}

export default function ResendTransferDialog({
  isOpen,
  onOpenChange,
  type,
  selectedTransfer,
  handleResend,
  selectedObjectId,
  setSelectedObjectId,
}: ResendTransferDialogProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const { data: objects, isLoading } = useObjects({
    status: "OPEN",
    searchQuery: "",
  });
  const availableObjects = objects.filter(
    (obj: Object) => obj.id !== selectedTransfer.fromObjectId
  );

  const selectedObject = availableObjects.find(
    (obj: Object) => obj.id === selectedObjectId
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "tool" && "Переместить инструмент"}
            {type === "device" && "Переместить устройство"}
            {type === "clothes" && `Переместить спецодежду`}
          </DialogTitle>
          <DialogDescription className="text-transparent w-0 h-0">
            Выберите объект для переотправки
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <TranferDetailsCardDialog
            selectedTransfer={selectedTransfer}
            type={type}
          />
          <div className="space-y-2 mt-7">
            <Label htmlFor="target-object">Объект:</Label>
            <Select
              value={selectedObjectId}
              onValueChange={setSelectedObjectId}
            >
              <SelectTrigger className="w-full" id="target-object">
                <SelectValue placeholder="Выберите объект" />
              </SelectTrigger>
              <SelectContent>
                {availableObjects.map((object: Object) => (
                  <SelectItem key={object.id} value={object.id}>
                    <div className="flex items-center gap-2">
                      <span>{object.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedObject && (
            <div className="bg-blue-100 p-3 rounded-lg border border-blue-300">
              <p className="text-sm text-blue-800">
                <strong>Инструмент будет отправлен на:</strong>
              </p>
              <p className="text-sm font-medium text-blue-900 mt-1">
                {selectedObject.name}
              </p>
            </div>
          )}
        </div>

        {/* ✅ Чекбокс подтверждения */}
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="confirm-writeoff"
            checked={isConfirmed}
            onCheckedChange={(val) => setIsConfirmed(!!val)}
          />
          <Label htmlFor="confirm-writeoff" className="text-sm">
            Я подтверждаю перемещение.
          </Label>
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Отмена
          </Button>
          <Button
            onClick={handleResend}
            disabled={!selectedObjectId || isLoading || !isConfirmed}
          >
            {"Переотправить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
