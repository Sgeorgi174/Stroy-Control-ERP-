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
  nullElement?: boolean; // Показывать ли "не назначено"
};

export function ObjectSelectForFilter({
  objects,
  nullElement = false,
}: ObjectSelectProps) {
  const { selectedObjectId, setSelectedObjectId } = useFilterPanelStore();

  return (
    <Select
      value={selectedObjectId ?? "null"}
      onValueChange={(value) => {
        if (value === "all") {
          setSelectedObjectId("all");
        } else if (value === "null") {
          setSelectedObjectId(null);
        } else {
          setSelectedObjectId(value);
        }
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Объект" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Фильтр по объекту</SelectLabel>
          <SelectItem value="all">Все</SelectItem>
          {nullElement && <SelectItem value="null">Не назначено</SelectItem>}
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
