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
import type { DeviceStatus } from "@/types/device";
import type { ToolStatus } from "@/types/tool";

export function ItemStatusSelectForFilter() {
  const { selectedItemStatus, setSelectedItemStatus } = useFilterPanelStore();

  return (
    <Select
      value={selectedItemStatus ?? "null"}
      onValueChange={(value) =>
        setSelectedItemStatus(
          value === "null" ? null : (value as DeviceStatus | ToolStatus)
        )
      }
    >
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="Статус" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Статус</SelectLabel>
          <SelectItem value="null">Все</SelectItem>
          <SelectItem value="ON_OBJECT">На объекте</SelectItem>
          <SelectItem value="IN_TRANSIT">В пути</SelectItem>
          <SelectItem value="IN_REPAIR">Сломан</SelectItem>
          <SelectItem value="LOST">На ремонте</SelectItem>
          <SelectItem value="WRITTEN_OFF">Списан</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
