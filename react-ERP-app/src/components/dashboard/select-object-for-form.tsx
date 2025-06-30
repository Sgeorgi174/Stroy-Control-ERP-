import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Object } from "@/types/object";

type ObjectSelectProps = {
  objects: Object[];
  selectedObjectId: string;
  onSelectChange: (id: string | null) => void;
  disabled?: boolean;
  isEmptyElement?: boolean;
  className?: string;
};

export function ObjectSelectForForms({
  objects,
  selectedObjectId,
  onSelectChange,
  disabled,
  isEmptyElement = false,
  className,
}: ObjectSelectProps) {
  return (
    <Select
      disabled={disabled}
      value={selectedObjectId || ""}
      onValueChange={(value) => onSelectChange(value)}
    >
      <SelectTrigger className={cn("w-[200px]", className ? className : "")}>
        <SelectValue placeholder="Выберите объект" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Объекты</SelectLabel>
          {isEmptyElement && <SelectItem value="none">Не назначать</SelectItem>}
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
