import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { getCurrentMonthRange } from "@/lib/utils/date-filters";
import type { GetOvertimeFilterDto } from "@/types/dto/overtime.dto";

interface OvertimeFiltersProps {
  filters: GetOvertimeFilterDto;
  setFilters: (filters: GetOvertimeFilterDto) => void;
}

export function OvertimeFilters({ filters, setFilters }: OvertimeFiltersProps) {
  // При первом рендере устанавливаем текущий месяц, если фильтры пусты
  useEffect(() => {
    if (!filters.startDate && !filters.endDate) {
      setFilters({ ...filters, ...getCurrentMonthRange() });
    }
  }, []);

  const clearFilters = () => setFilters({});

  const updateDate = (key: "startDate" | "endDate", date: Date | undefined) => {
    setFilters({
      ...filters,
      [key]: date ? format(date, "yyyy-MM-dd") : undefined,
    });
  };

  return (
    <div className="flex flex-wrap items-end gap-4 bg-card p-4 rounded-xl border shadow-sm">
      {/* Селект статуса */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase text-muted-foreground ml-1">
          Статус
        </span>
        <Select
          value={filters.status || "all"}
          onValueChange={(v) =>
            setFilters({
              ...filters,
              status: v === "all" ? undefined : (v as any),
            })
          }
        >
          <SelectTrigger className="w-[200px] h-10">
            <SelectValue placeholder="Все статусы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="PENDING">На рассмотрении</SelectItem>
            <SelectItem value="APPROVED">Одобрено</SelectItem>
            <SelectItem value="REJECTED">Отклонено</SelectItem>
            <SelectItem value="PROCESSED">Завершено</SelectItem>
            <SelectItem value="CANCELED">Отменено</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* С даты */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase text-muted-foreground ml-1">
          С даты
        </span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[180px] h-10 justify-start text-left font-normal",
                !filters.startDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.startDate
                ? format(parseISO(filters.startDate), "PPP", { locale: ru })
                : "Выберите дату"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={
                filters.startDate ? parseISO(filters.startDate) : undefined
              }
              onSelect={(date) => updateDate("startDate", date)}
              initialFocus
              locale={ru}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* По дату */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase text-muted-foreground ml-1">
          По дату
        </span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[180px] h-10 justify-start text-left font-normal",
                !filters.endDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.endDate
                ? format(parseISO(filters.endDate), "PPP", { locale: ru })
                : "Выберите дату"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.endDate ? parseISO(filters.endDate) : undefined}
              onSelect={(date) => updateDate("endDate", date)}
              initialFocus
              locale={ru}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Кнопка сброса */}
      <div className="flex items-center">
        {(filters.status || filters.startDate || filters.endDate) && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="h-10 text-muted-foreground hover:text-destructive gap-2"
          >
            <X className="w-4 h-4" />
            Сбросить
          </Button>
        )}
      </div>
    </div>
  );
}
