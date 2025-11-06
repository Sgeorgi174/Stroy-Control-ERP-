import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterPanelStore } from "@/stores/filter-panel-store";
import type { Positions } from "@/types/employee";

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

export function PositionSelectForFilter() {
  const { selectedEmployeePosition, setSetelectedEmployeePosition } =
    useFilterPanelStore();

  return (
    <Select
      value={selectedEmployeePosition ?? "null"}
      onValueChange={(value) =>
        setSetelectedEmployeePosition(
          value === "null" ? null : (value as Positions)
        )
      }
    >
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Должность" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Фильтр по должностям</SelectLabel>
          <SelectItem value="null">Все</SelectItem>
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
