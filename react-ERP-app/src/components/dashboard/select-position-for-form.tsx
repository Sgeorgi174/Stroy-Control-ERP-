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
          <SelectItem value="FOREMAN">Бригадир</SelectItem>
          <SelectItem value="ELECTRICAN">Электромонтажник</SelectItem>
          <SelectItem value="LABORER">Разнорабочий</SelectItem>
          <SelectItem value="DESIGNER">Проектировщик</SelectItem>
          <SelectItem value="ENGINEER">Инженер</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
