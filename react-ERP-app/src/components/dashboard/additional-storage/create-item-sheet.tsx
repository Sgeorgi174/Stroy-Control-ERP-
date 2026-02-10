import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Package } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

export interface CreateItemFormData {
  name: string;
  quantity: number;
  price: number;
  description: string;
}

interface CreateItemSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: CreateItemFormData;
  onFormChange: (data: Partial<CreateItemFormData>) => void;
  onSubmit: (selectedDate: Date) => void; // ← передаем дату
  isLoading?: boolean;
}

export function CreateItemSheet({
  open,
  onOpenChange,
  formData,
  onFormChange,
  onSubmit,
  isLoading = false,
}: CreateItemSheetProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(date); // передаем выбранную дату
  };

  const [date, setDate] = useState<Date>(new Date());

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto p-4">
        <SheetHeader className="">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Новый товар</SheetTitle>
              <SheetDescription>
                Создайте новый товар для этого склада
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="item-name">Название *</Label>
            <Input
              id="item-name"
              placeholder="Название товара"
              value={formData.name}
              onChange={(e) => onFormChange({ name: e.target.value })}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="item-quantity">Количество</Label>
              <Input
                id="item-quantity"
                type="number"
                min={0}
                placeholder="0"
                value={formData.quantity || ""}
                onChange={(e) =>
                  onFormChange({ quantity: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-price">Цена (₽)</Label>
              <Input
                id="item-price"
                type="number"
                min={0}
                placeholder="0"
                value={formData.price || ""}
                onChange={(e) =>
                  onFormChange({ price: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Дата добавления</Label>
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
            <Label htmlFor="item-description">Описание</Label>
            <Textarea
              id="item-description"
              placeholder="Дополнительная информация о товаре"
              rows={3}
              value={formData.description}
              onChange={(e) => onFormChange({ description: e.target.value })}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!formData.name.trim() || isLoading}
          >
            {isLoading ? "Добавление..." : "Добавить товар"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
