import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SeasonSelectProps = {
  selectedSeason: string | null;
  onSelectChange: (season: string | null) => void;
};

export function SeasonSelectForForms({
  selectedSeason,
  onSelectChange,
}: SeasonSelectProps) {
  return (
    <Select
      value={selectedSeason ?? "null"}
      onValueChange={(value) => onSelectChange(value === "null" ? null : value)}
      defaultValue="SUMMER"
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Объект" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Объекты</SelectLabel>
          <SelectItem value="SUMMER">Лето</SelectItem>
          <SelectItem value="WINTER">Зима</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
