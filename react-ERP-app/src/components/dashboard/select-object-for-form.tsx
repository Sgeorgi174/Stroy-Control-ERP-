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
  selectedObjectId: string;
  onSelectChange: (id: string) => void;
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
      value={selectedObjectId ?? ""}
      onValueChange={(value) => onSelectChange(value)}
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
