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
import type { TabletStatus } from "@/types/tablet";

export function TabletStatusSelectForFilter() {
  const { selectedTabletStatus, setSelectedTabletStatus } =
    useFilterPanelStore();

  return (
    <Select
      value={selectedTabletStatus ?? "null"}
      onValueChange={(value) =>
        setSelectedTabletStatus(
          value === "null" ? null : (value as TabletStatus)
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
          <SelectItem value="ACTIVE">Активен</SelectItem>
          <SelectItem value="INACTIVE">Свободен</SelectItem>
          <SelectItem value="IN_REPAIR">На ремонте</SelectItem>
          <SelectItem value="LOST">Утерян</SelectItem>
          <SelectItem value="WRITTEN_OFF">Списан</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
