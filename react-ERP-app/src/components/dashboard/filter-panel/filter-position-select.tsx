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
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Должность" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Фильтр по должностям</SelectLabel>
          <SelectItem value="null">Все</SelectItem>
          <SelectItem value="FOREMAN">Мастер</SelectItem>
          <SelectItem value="ELECTRICAN">Электромонтажник</SelectItem>
          <SelectItem value="LABORER">Разнорабочий</SelectItem>
          <SelectItem value="DESIGNER">Проектировщик</SelectItem>
          <SelectItem value="ENGINEER">Инженер</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
