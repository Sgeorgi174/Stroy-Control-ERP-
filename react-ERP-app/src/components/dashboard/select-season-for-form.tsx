import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Season } from "@/types/season";

type SeasonSelectProps = {
  selectedSeason: Season;
  onSelectChange: (season: Season) => void;
  className?: string;
};

export function SeasonSelectForForms({
  selectedSeason,
  onSelectChange,
  className,
}: SeasonSelectProps) {
  return (
    <Select
      value={selectedSeason}
      onValueChange={(value) => onSelectChange(value as Season)}
      defaultValue="SUMMER"
    >
      <SelectTrigger className={cn("w-[200px]", className ? className : "")}>
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
