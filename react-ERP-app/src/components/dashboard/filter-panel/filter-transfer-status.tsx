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
import type { PendingStatus } from "@/types/transfers";

export function TransferStatusForFilter() {
  const { selectedTransferStatus, setSelectedTransferStatus } =
    useFilterPanelStore();

  return (
    <div className="flex gap-2">
      <Label>Статус:</Label>
      <Select
        value={selectedTransferStatus ?? "all"}
        onValueChange={(value) =>
          setSelectedTransferStatus(
            value === "all" ? null : (value as PendingStatus)
          )
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Статус" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Фильтр по статусу</SelectLabel>
            <SelectItem value="all">Все</SelectItem>
            <SelectItem value="IN_TRANSIT">В пути</SelectItem>
            <SelectItem value="CONFIRM">Подтверждено</SelectItem>
            <SelectItem value="CANCEL">Отменено</SelectItem>
            <SelectItem value="REJECT">Отказ</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
