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
};

export function SelectTabletStatusForForms({
  selectedStatus,
  onSelectChange,
}: SelectTabletStatusForFormsProps) {
  return (
    <Select
      value={selectedStatus}
      onValueChange={(value) => onSelectChange(value)}
      defaultValue="ACTIVE"
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Статус" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Статус</SelectLabel>
          <SelectItem value="ACTIVE">Активен</SelectItem>
          <SelectItem value="IN_REPAIR">В ремонте</SelectItem>
          <SelectItem value="LOST">Потерян</SelectItem>
          <SelectItem value="WRITTEN_OFF">Списан</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
