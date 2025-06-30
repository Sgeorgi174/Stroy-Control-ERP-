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
import type { EmployeeStatuses } from "@/types/employee";

export function EmployeeStatusForFilter() {
  const { selectedEmployeeStatus, setSetelectedEmployeeStatus } =
    useFilterPanelStore();

  return (
    <Select
      value={selectedEmployeeStatus}
      onValueChange={(value) =>
        setSetelectedEmployeeStatus(value as EmployeeStatuses)
      }
    >
      <SelectTrigger className="w-[80px]">
        <SelectValue placeholder="Статус" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Фильтр по статусу</SelectLabel>
          <SelectItem value="null">Все</SelectItem>
          <SelectItem value="OK">
            <span className="h-3 w-3 rounded-full text-center glow-green"></span>
          </SelectItem>
          <SelectItem value="WARNING">
            <span className="h-3 w-3 rounded-full text-center glow-yellow"></span>
          </SelectItem>
          <SelectItem value="OVERDUE">
            <span className="h-3 w-3 rounded-full text-center glow-red"></span>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
