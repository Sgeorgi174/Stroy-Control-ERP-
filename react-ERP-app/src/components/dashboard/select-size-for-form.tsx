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
import { useFilterPanelStore } from "@/stores/filter-panel-store";

type SizeSelectProps = {
  selectedSize: number;
  onSelectChange: (size: number) => void;
};

export function SizeSelectForForms({
  selectedSize,
  onSelectChange,
}: SizeSelectProps) {
  const { activeTab } = useFilterPanelStore();

  if (activeTab === "tool") return <div>У инструмента нет размера</div>;

  const currentSizesList =
    activeTab === "clothing" ? clothisngSizes : shoesSizes;

  // Выбираем первый размер из списка, если вдруг selectedSize не совпадает
  const validSelectedSize = currentSizesList.includes(selectedSize.toString())
    ? selectedSize
    : Number(currentSizesList[0]);

  return (
    <Select
      value={validSelectedSize.toString()}
      onValueChange={(value) => onSelectChange(Number(value))}
    >
      <SelectTrigger className="w-[200px]">
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
