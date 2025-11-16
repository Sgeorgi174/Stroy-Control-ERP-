import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EmployeeClothingItem } from "@/types/employeesClothing";
import { useState } from "react";

interface DebtActionDialogProps {
  clothing: EmployeeClothingItem;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (amount: string) => void;
  actionType: "reduce" | "writeoff";
}

export function DebtActionDialog({
  clothing,
  isOpen,
  onOpenChange,
  onConfirm,
  actionType,
}: DebtActionDialogProps) {
  const [amount, setAmount] = useState("");

  const parsedAmount = Number.parseFloat(amount);
  const isAmountValid =
    amount.trim() !== "" &&
    !Number.isNaN(parsedAmount) &&
    parsedAmount > 0 &&
    parsedAmount <= Number(clothing.debtAmount);

  const handleConfirm = () => {
    const numAmount =
      actionType === "writeoff" ? Number(clothing.debtAmount) : parsedAmount;

    if (actionType === "writeoff" || (isAmountValid && parsedAmount > 0)) {
      onConfirm(String(numAmount));
      setAmount("");
      onOpenChange(false);
    }
  };

  // Округляем до одного знака после запятой
  const priceIssued = Math.round(Number(clothing.priceWhenIssued) * 10) / 10;
  const remainingDebt =
    Math.round(
      (Number(clothing.priceWhenIssued) - Number(clothing.debtAmount)) * 10
    ) / 10;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {actionType === "reduce"
              ? "Частичное погашение долга"
              : "Списание долга"}
          </DialogTitle>
          <DialogDescription>
            {clothing.clothing.name} — Остаток долга: {remainingDebt.toFixed(1)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Цена при выдаче:</span>
                <p className="font-medium">{priceIssued.toFixed(1)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Всего оплачено:</span>
                <p className="font-medium">{remainingDebt.toFixed(1)}</p>
              </div>
            </div>
          </div>

          {actionType === "reduce" && (
            <div>
              <Label htmlFor="amount">Сумма к погашению (₽)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                min={0}
                max={clothing.debtAmount}
                className="mt-2"
              />
              {!isAmountValid && amount && (
                <p className="text-sm text-red-500 mt-1">
                  Введите сумму от 1 до {clothing.debtAmount}
                </p>
              )}
            </div>
          )}

          {actionType === "writeoff" && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-sm text-red-800">
                Вы собираетесь списать весь оставшийся долг в размере{" "}
                {Number(clothing.debtAmount).toFixed(1)}. Это действие нельзя
                отменить.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={actionType === "reduce" && !isAmountValid}
            variant={actionType === "writeoff" ? "destructive" : "default"}
          >
            {actionType === "reduce" ? "Погасить" : "Списать долг"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
