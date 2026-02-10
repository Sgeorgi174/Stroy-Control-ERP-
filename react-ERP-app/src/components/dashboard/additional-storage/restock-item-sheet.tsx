"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon, PackagePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface Item {
  id: string;
  name: string;
  quantity: number;
}

interface RestockItemSheetProps {
  item: Item | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: {
    itemId: string;
    quantity: number;
    comment: string;
    date: Date;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function RestockItemSheet({
  item,
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: RestockItemSheetProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [comment, setComment] = useState("");
  const [date, setDate] = useState<Date>(new Date());

  const handleSubmit = async () => {
    if (!item || quantity <= 0) return;
    await onSubmit?.({ itemId: item.id, quantity, comment, date });
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setQuantity(1);
    setComment("");
    setDate(new Date());
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
    }
    onOpenChange(isOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-md p-4">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <PackagePlus className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <SheetTitle>Пополнить товар</SheetTitle>
              <SheetDescription>{item?.name}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">Текущий остаток</p>
            <p className="text-2xl font-semibold tabular-nums">
              {item?.quantity ?? 0}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                шт.
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="restock-quantity">Количество</Label>
            <Input
              id="restock-quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Введите количество"
            />
            <p className="text-xs text-muted-foreground">
              После пополнения: {(item?.quantity ?? 0) + quantity} шт.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Дата пополнения</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ru }) : "Выберите дату"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                  locale={ru}
                  weekStartsOn={1} // начало недели с понедельника
                  captionLayout="dropdown" // чтобы можно было выбирать месяц и год
                  classNames={{
                    months_dropdown: "bg-muted",
                    years_dropdown: "bg-muted",
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="restock-comment">Комментарий</Label>
            <Textarea
              id="restock-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Опишите причину пополнения..."
              rows={3}
            />
          </div>
        </div>

        <SheetFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || quantity <= 0}
            className="gap-2"
          >
            {isLoading ? "Сохранение..." : "Пополнить"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
