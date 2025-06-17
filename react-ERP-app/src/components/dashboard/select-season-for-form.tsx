import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Season } from "@/types/season";

type SeasonSelectProps = {
  selectedSeason: Season;
  onSelectChange: (season: Season) => void;
};

export function SeasonSelectForForms({
  selectedSeason,
  onSelectChange,
}: SeasonSelectProps) {
  return (
    <Select
      value={selectedSeason}
      onValueChange={(value) => onSelectChange(value as Season)}
      defaultValue="SUMMER"
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Сезон" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Сезон</SelectLabel>
          <SelectItem value="SUMMER">Лето</SelectItem>
          <SelectItem value="WINTER">Зима</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
