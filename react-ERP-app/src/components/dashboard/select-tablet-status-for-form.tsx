import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TabletStatus } from "@/types/tablet";

type SelectTabletStatusForFormsProps = {
  selectedStatus: TabletStatus;
  onSelectChange: (season: string) => void;
  currentStatus: TabletStatus;
};

const itemList = [
  { value: "ACTIVE", label: "Активен" },
  { value: "IN_REPAIR", label: "В ремонте" },
  { value: "LOST", label: "Потерян" },
  { value: "WRITTEN_OFF", label: "Списан" },
];

export function SelectTabletStatusForForms({
  selectedStatus,
  currentStatus,
  onSelectChange,
}: SelectTabletStatusForFormsProps) {
  const filteredStatus = itemList.filter(
    (item) => item.value !== currentStatus
  );
  return (
    <Select
      value={selectedStatus}
      onValueChange={(value) => onSelectChange(value)}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Новый статус" />
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
