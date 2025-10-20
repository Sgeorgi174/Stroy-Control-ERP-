import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClothingHeights } from "@/hooks/clothes/useClothes";
import { cn } from "@/lib/utils";

type HeightSelectProps = {
  selectedHeight: string | undefined;
  onSelectChange: (height: string) => void;
  className?: string;
  disabled?: boolean;
};

export function HeightSelectForForms({
  selectedHeight,
  onSelectChange,
  className,
  disabled = false,
}: HeightSelectProps) {
  const { data: clothesHeights = [] } = useClothingHeights();

  return (
    <Select
      disabled={disabled}
      value={selectedHeight}
      onValueChange={(value) => onSelectChange(value)}
    >
      <SelectTrigger className={cn("w-[200px]", className ? className : "")}>
        <SelectValue placeholder="Ростовка" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Ростовка</SelectLabel>
          {clothesHeights.map((height) => (
            <SelectItem key={height.id} value={height.id}>
              {height.height}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
