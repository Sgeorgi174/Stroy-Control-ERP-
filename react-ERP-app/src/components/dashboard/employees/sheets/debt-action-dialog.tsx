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
  onConfirm: (amount: number) => void;
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

  const handleConfirm = () => {
    const numAmount =
      actionType === "writeoff"
        ? clothing.debtAmount
        : Number.parseFloat(amount);
    if (numAmount > 0) {
      onConfirm(numAmount);
      setAmount("");
      onOpenChange(false);
    }
  };

  const remainingDebt = clothing.priceWhenIssued - clothing.debtAmount;

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
            {clothing.clothing.name} - Остаток долга: {clothing.debtAmount}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Цена при выдаче:</span>
                <p className="font-medium">{clothing.priceWhenIssued}</p>
              </div>
              <div>
                <span className="text-gray-500">Всего оплачено:</span>
                <p className="font-medium">{remainingDebt}</p>
              </div>
            </div>
          </div>

          {actionType === "reduce" && (
            <div>
              <Label htmlFor="amount">Сумма к погашению (₽)</Label>
              <Input
                id="amount"
                type="number"
                max={remainingDebt}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
              />
            </div>
          )}

          {actionType === "writeoff" && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-sm text-red-800">
                Вы собираетесь списать весь оставшийся долг в размере{" "}
                {clothing.debtAmount}. Это действие нельзя отменить.
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
            disabled={
              actionType === "reduce" &&
              (!amount || Number.parseFloat(amount) <= 0)
            }
            variant={actionType === "writeoff" ? "destructive" : "default"}
          >
            {actionType === "reduce" ? "Погасить" : "Списать долг"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
