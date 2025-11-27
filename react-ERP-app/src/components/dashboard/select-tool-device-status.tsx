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
  selectedStatus: ToolStatus | DeviceStatus;
  onSelectChange: (status: string) => void;
  disabled?: boolean;
  currentStatus: ToolStatus | DeviceStatus;
};

const itemList = [
  { value: "ON_OBJECT", label: "На объекте" },
  { value: "IN_REPAIR", label: "Сломан" },
  { value: "LOST", label: "На ремонте" },
  { value: "WRITTEN_OFF", label: "Списан" },
];

export function SelectStatusToolOrDeviceForForms({
  selectedStatus,
  onSelectChange,
  disabled,
  currentStatus,
}: SelectStatusToolOrDeviceForFormsProps) {
  const filteredStatus = itemList.filter(
    (item) => item.value !== currentStatus
  );

  return (
    <Select
      value={selectedStatus ?? ""}
      onValueChange={(value) => onSelectChange(value)}
      disabled={disabled}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Выберите статус" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Статус</SelectLabel>
          {filteredStatus.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
