// src/components/object/close-object-dialog.tsx
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";

type CloseObjectDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const CloseObjectDialog = ({
  open,
  onClose,
  onConfirm,
}: CloseObjectDialogProps) => {
  const [checked, setChecked] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Вы уверены, что хотите закрыть объект?</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-4">
          <Checkbox
            id="confirm-close"
            checked={checked}
            onCheckedChange={(value) => setChecked(Boolean(value))}
          />
          <Label htmlFor="confirm-close">Я подтверждаю закрытие объекта</Label>
        </div>
        <DialogFooter className="mt-6">
          <Button variant="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={!checked}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
