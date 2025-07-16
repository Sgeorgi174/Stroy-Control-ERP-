import { BootIcon } from "@/components/ui/boot";
import { Input } from "@/components/ui/input";
import type { PendingClothesTransfer } from "@/types/transfers";
import { Shirt } from "lucide-react";

type ClothesInfoProps = {
  clothesTransfer: PendingClothesTransfer;
  quantity?: number;
  setQuantity?: (val: number) => void;
  isReject?: boolean;
};

export function ClothesInfo({
  clothesTransfer,
  quantity,
  setQuantity,
  isReject = true,
}: ClothesInfoProps) {
  return (
    <div className="flex justify-between items-center gap-3 p-3 rounded-lg bg-muted">
      <div className="flex gap-4 items-center">
        <div className="w-8 h-8 rounded-md flex items-center justify-center">
          {clothesTransfer.clothes.type === "CLOTHING" ? (
            <Shirt className="w-6 h-6" />
          ) : (
            <BootIcon className="w-6 h-6" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium text-sm">
              {clothesTransfer.clothes.name}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="font-mono">
              Сезон:{" "}
              {clothesTransfer.clothes.season === "SUMMER" ? "Лето" : "Зима"}
            </span>
            <span className="font-mono">
              Размер: {clothesTransfer.clothes.size}
            </span>
            <span className="font-mono">
              Кол-во: {clothesTransfer.quantity}
            </span>
          </div>
        </div>
      </div>

      {!isReject && (
        <div className="flex flex-col gap-2">
          <p className="text-xs">Подтвержденное кол-во:</p>
          <Input
            className="bg-primary-foreground w-[160px]"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="0"
            value={quantity}
            onChange={(e) => {
              if (setQuantity) setQuantity(Number(e.target.value));
            }}
          />
        </div>
      )}
    </div>
  );
}
