import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Object } from "@/types/object";

type ObjectSelectProps = {
  objects: Object[];
  selectedObjectId: string | null;
  onSelectChange: (id: string | null) => void;
  disabled?: boolean;
};

export function ObjectSelectForForms({
  objects,
  selectedObjectId,
  onSelectChange,
  disabled,
}: ObjectSelectProps) {
  return (
    <Select
      disabled={disabled}
      value={selectedObjectId ?? "null"}
      onValueChange={(value) => onSelectChange(value === "null" ? null : value)}
      defaultValue={objects[0].id}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Объект" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Объекты</SelectLabel>
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
