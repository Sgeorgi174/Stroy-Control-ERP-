import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { historyTransfer } from "@/constants/historyTransfer";
import { formatDate, formatTime } from "@/lib/utils/format-date";
import { useFilterPanelStore } from "@/stores/filter-panel-store";

export function TransferHistoryTable() {
  const { activeTab } = useFilterPanelStore();
  return (
    <Table className="mt-6">
      <TableHeader>
        <TableRow>
          <TableHead>Дата</TableHead>
          <TableHead>Время</TableHead>
          <TableHead>Кто</TableHead>
          {activeTab !== "tool" && <TableHead>Кол-во</TableHead>}
          <TableHead>Откуда</TableHead>
          <TableHead>Куда</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {historyTransfer.map((transfer) => (
          <TableRow key={transfer.id}>
            <TableCell>{formatDate(transfer.createdAt)}</TableCell>
            <TableCell>{formatTime(transfer.createdAt)}</TableCell>
            <TableCell>
              {`${transfer.movedBy.firstName} ${transfer.movedBy.lastName}`}
            </TableCell>
            {activeTab !== "tool" && <TableCell>{transfer.quantity}</TableCell>}
            <TableCell>{transfer.toObject.name}</TableCell>
            <TableCell>{transfer.fromObject.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
