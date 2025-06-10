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
  selectedSize: number | null;
  onSelectChange: (size: number | null) => void;
};

export function SizeSelectForForms({
  selectedSize,
  onSelectChange,
}: SizeSelectProps) {
  const { activeTab } = useFilterPanelStore();

  if (activeTab === "tool") return <div>У инструмента нет размера</div>;

  const currentSizesList =
    activeTab === "clothing" ? clothisngSizes : shoesSizes;

  return (
    <Select
      value={selectedSize !== null ? selectedSize.toString() : "null"}
      onValueChange={(value) =>
        onSelectChange(value === "null" ? null : Number(value))
      }
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
