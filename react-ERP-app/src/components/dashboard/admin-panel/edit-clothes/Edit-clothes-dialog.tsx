import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Edit3 } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SizeSelectForForms } from "../../select-size-for-form";
import { HeightSelectForForms } from "../../select-height-for-form";

type ClothingItem = {
  id: string;
  priceWhenIssued: number;
  issuedAt: string;
  debtAmount: number;
  clothing: {
    id: string;
    name: string;
    clothingHeight?: { id: string; height: string } | null;
    clothingSize?: { id: string; size: string } | null;
    footwearSize?: { id: string; size: string } | null;
    season: string;
  };
};

type Props = {
  clothingItem: ClothingItem;
  onSave: (updated: {
    id: string;
    priceWhenIssued: number;
    debtAmount: number;
    issuedAt: string;
    clothingSizeId?: string | null;
    clothingHeightId?: string | null;
    footwearSizeId?: string | null;
  }) => void;
};

export function EditIssuedClothingDialog({ clothingItem, onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [priceWhenIssued, setPriceWhenIssued] = useState(
    clothingItem.priceWhenIssued
  );
  const [debtAmount, setDebtAmount] = useState(clothingItem.debtAmount);
  const [issuedAt, setIssuedAt] = useState<Date | undefined>(
    new Date(clothingItem.issuedAt)
  );

  const [month, setMonth] = useState<Date>(new Date(clothingItem.issuedAt));

  const [clothingSizeId, setClothingSizeId] = useState<string | undefined>(
    clothingItem.clothing.clothingSize?.id
  );
  const [clothingHeightId, setClothingHeightId] = useState<string | undefined>(
    clothingItem.clothing.clothingHeight?.id
  );
  const [footwearSizeId, setFootwearSizeId] = useState<string | undefined>(
    clothingItem.clothing.footwearSize?.id
  );

  const handleSave = () => {
    if (!issuedAt) return;
    onSave({
      id: clothingItem.id,
      priceWhenIssued,
      debtAmount,
      issuedAt: issuedAt.toISOString(),
      clothingSizeId,
      clothingHeightId,
      footwearSizeId,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit3 className="w-4 h-4 mr-1" />
          Редактировать
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Редактировать спецовку — {clothingItem.clothing.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* ====== Дата выдачи ====== */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Дата выдачи</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[200px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {issuedAt
                    ? format(issuedAt, "dd MMM yyyy", { locale: ru })
                    : "Выберите дату"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" align="end">
                <Calendar
                  mode="single"
                  selected={issuedAt}
                  onSelect={setIssuedAt}
                  month={month}
                  onMonthChange={setMonth}
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* ====== Цена ====== */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Цена при выдаче</label>
            <Input
              type="number"
              value={priceWhenIssued}
              onChange={(e) => setPriceWhenIssued(Number(e.target.value))}
              className="w-[200px]"
            />
          </div>

          {/* ====== Задолженность ====== */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Задолженность</label>
            <Input
              type="number"
              value={debtAmount}
              onChange={(e) => setDebtAmount(Number(e.target.value))}
              className="w-[200px]"
            />
          </div>

          {/* ====== Размер одежды ====== */}
          {clothingItem.clothing.clothingSize && (
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Размер одежды</label>
              <SizeSelectForForms
                selectedSize={clothingSizeId}
                onSelectChange={setClothingSizeId}
                type="CLOTHING"
              />
            </div>
          )}

          {/* ====== Ростовка ====== */}
          {clothingItem.clothing.clothingHeight && (
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Ростовка</label>
              <HeightSelectForForms
                selectedHeight={clothingHeightId}
                onSelectChange={setClothingHeightId}
              />
            </div>
          )}

          {/* ====== Размер обуви ====== */}
          {clothingItem.clothing.footwearSize && (
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Размер обуви</label>
              <SizeSelectForForms
                selectedSize={footwearSizeId}
                onSelectChange={setFootwearSizeId}
                type="FOOTWEAR"
              />
            </div>
          )}
        </div>

        {/* ====== Кнопки ====== */}
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave}>Сохранить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
