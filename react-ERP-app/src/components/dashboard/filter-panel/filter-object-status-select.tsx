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
import type { ObjectStatus } from "@/types/object";

export function ObjectStatusSelectForFilter() {
  const { selectedObjectStatus, setSetelectedObjectStatus } =
    useFilterPanelStore();

  return (
    <Select
      value={selectedObjectStatus}
      onValueChange={(value) =>
        setSetelectedObjectStatus(value as ObjectStatus)
      }
    >
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="Статус" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Статус</SelectLabel>
          <SelectItem value="OPEN">Открытые</SelectItem>
          <SelectItem value="CLOSE">Закрытые</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
