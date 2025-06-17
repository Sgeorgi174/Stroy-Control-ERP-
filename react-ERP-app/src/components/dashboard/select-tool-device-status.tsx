import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DeviceStatus } from "@/types/device";
import type { ToolStatus } from "@/types/tool";

type SelectStatusToolOrDeviceForFormsProps = {
  selectedStatus: ToolStatus | DeviceStatus | null;
  onSelectChange: (season: string | null) => void;
};

export function SelectStatusToolOrDeviceForForms({
  selectedStatus,
  onSelectChange,
}: SelectStatusToolOrDeviceForFormsProps) {
  return (
    <Select
      value={selectedStatus ?? "null"}
      onValueChange={(value) => onSelectChange(value === "null" ? null : value)}
      defaultValue="ON_OBJECT"
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Статус" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Объекты</SelectLabel>
          <SelectItem value="ON_OBJECT">На объекте</SelectItem>
          <SelectItem value="IN_REPAIR">В ремонте</SelectItem>
          <SelectItem value="LOST">Потерян</SelectItem>
          <SelectItem value="WRITTEN_OFF">Списан</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
