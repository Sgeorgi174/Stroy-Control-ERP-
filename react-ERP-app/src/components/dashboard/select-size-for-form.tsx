import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { clothisngSizes, shoesSizes } from "@/constants/sizes";
import { cn } from "@/lib/utils";

type SizeSelectProps = {
  selectedSize: number;
  onSelectChange: (size: number) => void;
  type: "CLOTHING" | "FOOTWEAR";
  className?: string;
};

export function SizeSelectForForms({
  selectedSize,
  onSelectChange,
  type,
  className,
}: SizeSelectProps) {
  const currentSizesList = type === "CLOTHING" ? clothisngSizes : shoesSizes;

  // Выбираем первый размер из списка, если вдруг selectedSize не совпадает
  const validSelectedSize = currentSizesList.includes(selectedSize.toString())
    ? selectedSize
    : Number(currentSizesList[0]);

  return (
    <Select
      value={validSelectedSize.toString()}
      onValueChange={(value) => onSelectChange(Number(value))}
    >
      <SelectTrigger className={cn("w-[200px]", className ? className : "")}>
        <SelectValue placeholder="Размер" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Размер</SelectLabel>
          {currentSizesList.map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
