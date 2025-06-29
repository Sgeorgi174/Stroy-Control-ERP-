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

export function EmployeeTypeForFilter() {
  const { selectedEmployeeType, setSetelectedEmployeeType } =
    useFilterPanelStore();

  return (
    <Select
      value={selectedEmployeeType}
      onValueChange={(value) =>
        setSetelectedEmployeeType(value as "ACTIVE" | "ARCHIVE")
      }
    >
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="Сотрудники" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Сотрудники</SelectLabel>
          <SelectItem value="ACTIVE">Актуальные</SelectItem>
          <SelectItem value="ARCHIVE">Архив</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
