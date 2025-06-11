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

export function SeasonSelectForFilter() {
  const { selectedSeason, setSelectedSeason } = useFilterPanelStore();

  return (
    <Select
      value={selectedSeason ?? "null"}
      onValueChange={(value) =>
        setSelectedSeason(
          value === "null" ? null : (value as "SUMMER" | "WINTER")
        )
      }
    >
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Сезон" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Сезоны</SelectLabel>
          <SelectItem value="null">Все</SelectItem>
          <SelectItem value="SUMMER">Лето</SelectItem>
          <SelectItem value="WINTER">Зима</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
