import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useState } from "react";

export function DatePicker({
  selected,
  onSelect,
}: {
  selected?: string; // теперь это строка 'yyyy-MM-dd'
  onSelect?: (date: string | undefined) => void;
}) {
  const [open, setOpen] = useState(false);

  // Конвертим выбранную строку в Date для отображения в календаре
  const selectedDate = selected ? new Date(selected + "T00:00") : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (!date) return setOpen(false);

    // Формируем строку yyyy-MM-dd из локальной даты
    const localDateStr = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    onSelect?.(localDateStr);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`justify-start text-left font-normal w-[300px] ${
            !selected && "text-muted-foreground"
          }`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate
            ? format(selectedDate, "dd MMMM yyyy", { locale: ru })
            : "Выберите дату"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          locale={ru}
          weekStartsOn={1} // Пн — первый день недели
          captionLayout="dropdown" // Выбор месяца и года
          initialFocus
          fromYear={1950} // минимальный год
          toYear={2050} // максимальный год
          classNames={{
            months_dropdown: "bg-muted",
            years_dropdown: "bg-muted",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
