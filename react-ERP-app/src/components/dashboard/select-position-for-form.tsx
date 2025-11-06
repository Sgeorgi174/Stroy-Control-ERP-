import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Positions } from "@/types/employee";

type PositionSelectProps = {
  selectedPosition: Positions;
  onSelectChange: (season: Positions) => void;
  className?: string;
};

const positions: string[] = [
  "Мастер СМР",
  "Электромонтажник",
  "Разнорабочий",
  "Кладовщик",
  "Сварщик",
  "Расключник",
  "Помошник руководителя",
  "Инженер",
  "Начальник участка",
  "Бригадир",
  "Не назначен",
];

export function PositionSelectForForms({
  selectedPosition,
  onSelectChange,
  className,
}: PositionSelectProps) {
  return (
    <Select
      value={selectedPosition}
      onValueChange={(value) => onSelectChange(value as Positions)}
    >
      <SelectTrigger className={cn("w-[200px]", className ? className : "")}>
        <SelectValue placeholder="Должность" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Должность</SelectLabel>
          {positions.map((position) => (
            <SelectItem value={position} key={position}>
              {position}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
