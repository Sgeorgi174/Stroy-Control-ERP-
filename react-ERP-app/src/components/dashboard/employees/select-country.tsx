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
import type { Countries } from "@/types/employee";

type SelectCountryProps = {
  selectedCountry: string;
  onSelectChange: (country: Countries) => void;
  className?: string;
  disabled?: boolean;
};

export function SelectCountry({
  selectedCountry,
  onSelectChange,
  className,
  disabled = false,
}: SelectCountryProps) {
  return (
    <Select
      disabled={disabled}
      value={selectedCountry}
      onValueChange={(value) => onSelectChange(value as Countries)}
    >
      <SelectTrigger className={cn("w-[200px]", className ? className : "")}>
        <SelectValue placeholder="Гражданство" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Гражданство</SelectLabel>

          <SelectItem value="RU">Россия</SelectItem>
          <SelectItem value="KZ">Казахстан</SelectItem>
          <SelectItem value="TJ">Таджикистан</SelectItem>
          <SelectItem value="KG">Кыргызстан</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
