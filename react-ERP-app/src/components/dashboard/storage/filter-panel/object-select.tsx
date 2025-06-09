import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { objects } from "../../../../constants/objects";
import { useStorageTabStore } from "@/stores/storage-tab-store";

export function ObjectSelect() {
  const { selectedObjectId, setSelectedObjectId } = useStorageTabStore();

  return (
    <div className="flex items-center gap-2">
      <p className="font-medium">Объект:</p>
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
    </div>
  );
}
