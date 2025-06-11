import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterPanelStore } from "@/stores/filter-panel-store";
import type { Object } from "@/types/object";

type ObjectSelectProps = {
  objects: Object[];
};

export function ObjectSelectForFilter({ objects }: ObjectSelectProps) {
  const { selectedObjectId, setSelectedObjectId } = useFilterPanelStore();

  return (
    <Select
      value={selectedObjectId ?? "null"}
      onValueChange={(value) =>
        setSelectedObjectId(value === "null" ? null : value)
      }
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Объект" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Объекты</SelectLabel>
          <SelectItem value="null">Все</SelectItem>
          {objects.map((object) => (
            <SelectItem key={object.id} value={object.id}>
              {object.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
