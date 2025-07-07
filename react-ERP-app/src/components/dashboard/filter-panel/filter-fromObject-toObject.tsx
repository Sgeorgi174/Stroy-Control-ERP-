import { Label } from "@/components/ui/label";
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

export function FromObjectToObjectForFilter({ objects }: ObjectSelectProps) {
  const { fromObjectId, toObjectId, setFromObjectId, setToObjectId } =
    useFilterPanelStore();

  return (
    <div className="flex gap-5">
      <div className="flex gap-2">
        <Label>С объекта:</Label>
        <Select
          value={fromObjectId ?? "null"}
          onValueChange={(value) => {
            if (value === "all") {
              setFromObjectId("all");
            } else if (value === "null") {
              setFromObjectId(null);
            } else {
              setFromObjectId(value);
            }
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="С объекта" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Фильтр по объекту</SelectLabel>
              <SelectItem value="all">Все</SelectItem>
              {objects
                .filter((object) => object.id !== toObjectId)
                .map((object) => (
                  <SelectItem key={object.id} value={object.id}>
                    {object.name}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Label>На объект:</Label>
        <Select
          value={toObjectId ?? "null"}
          onValueChange={(value) => {
            if (value === "all") {
              setToObjectId("all");
            } else if (value === "null") {
              setToObjectId(null);
            } else {
              setToObjectId(value);
            }
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="На объект" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Фильтр по объекту</SelectLabel>
              <SelectItem value="all">Все</SelectItem>
              {objects
                .filter((object) => object.id !== fromObjectId)
                .map((object) => (
                  <SelectItem key={object.id} value={object.id}>
                    {object.name}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
