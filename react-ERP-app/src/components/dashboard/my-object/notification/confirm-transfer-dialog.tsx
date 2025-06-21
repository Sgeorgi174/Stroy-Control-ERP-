import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { NotificationWithType } from "@/types/notificationWithType";
import { useConfirmTransfer } from "@/hooks/useConfirmTransfer";

type ConfirmTransferDialogProps = {
  trigger: React.ReactNode;
  item: NotificationWithType;
};

export function ConfirmTransferDialog({
  trigger,
  item,
}: ConfirmTransferDialogProps) {
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);

  const { handleConfirm, isPending, isSuccess } = useConfirmTransfer(item);

  // Закрыть диалог после успешного подтверждения
  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      setChecked(false); // сбросить чекбокс на будущее
    }
  }, [isSuccess]);

  const isClothes = item.itemType === "clothes";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Подтверждение перемещения</DialogTitle>
          <DialogDescription>Подробная информация</DialogDescription>
        </DialogHeader>

        <div>
          <p>
            Наименование: <span>{item.name}</span>
          </p>
          {!isClothes && (
            <p>
              Серийный номер: <span>{item.serialNumber}</span>
            </p>
          )}
          {isClothes && (
            <>
              <p>
                Количество: <span>{item.inTransit}</span>
              </p>
              <p>
                Размер: <span>{item.size}</span>
              </p>
              <p>
                Сезон: <span>{item.season === "SUMMER" ? "Лето" : "Зима"}</span>
              </p>
            </>
          )}
          <div className="mt-5">
            <p>
              Объект: <span>{item.storage.name}</span>
            </p>
            <p>
              Ответственный:{" "}
              <span>{`${item.storage.foreman?.lastName} ${item.storage.foreman?.firstName}`}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 py-4">
          <Checkbox
            id="confirm-transfer"
            checked={checked}
            onCheckedChange={(val) => setChecked(val === true)}
          />
          <label htmlFor="confirm-transfer" className="text-sm">
            Подтверждаю получение
          </label>
        </div>

        <DialogFooter>
          <Button onClick={handleConfirm} disabled={!checked || isPending}>
            Подтвердить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
