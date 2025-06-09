import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStorageTabStore } from "@/stores/storage-tab-store";

export function SeasonSelect() {
  const { selectedSeason, setSelectedSeason } = useStorageTabStore();

  return (
    <div className="flex items-center gap-2">
      <p className="font-medium">Сезон:</p>
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
    </div>
  );
}
