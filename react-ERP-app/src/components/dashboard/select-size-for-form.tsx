import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClothingSizes, useFootwearSizes } from "@/hooks/clothes/useClothes";
import { cn } from "@/lib/utils";

type SizeSelectProps = {
  selectedSize: string | undefined;
  onSelectChange: (size: string) => void;
  type: "CLOTHING" | "FOOTWEAR";
  className?: string;
  disabled?: boolean;
};

export function SizeSelectForForms({
  selectedSize,
  onSelectChange,
  type,
  className,
  disabled = false,
}: SizeSelectProps) {
  const { data: clothesSizes = [] } = useClothingSizes();
  const { data: footwearSizes = [] } = useFootwearSizes();
  const currentSizesList = type === "CLOTHING" ? clothesSizes : footwearSizes;

  return (
    <Select
      disabled={disabled}
      value={selectedSize}
      onValueChange={(value) => onSelectChange(value)}
    >
      <SelectTrigger className={cn("w-[200px]", className ? className : "")}>
        <SelectValue placeholder="Размер" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Размер</SelectLabel>
          {currentSizesList.map((size) => (
            <SelectItem key={size.id} value={size.id}>
              {size.size}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
