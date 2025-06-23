import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatTime } from "@/lib/utils/format-date";
import { useFilterPanelStore } from "@/stores/filter-panel-store";
import type { TransferRecord } from "@/types/historyRecords";

type TransferHistoryTableProps = {
  transferRecords: TransferRecord[];
  isError: boolean;
};

export function TransferHistoryTable({
  transferRecords,
  isError,
}: TransferHistoryTableProps) {
  const { activeTab } = useFilterPanelStore();
  return (
    <div className="mt-6 rounded-lg border overflow-hidden">
      {" "}
      <Table>
        <TableHeader className="bg-primary pointer-events-none">
          <TableRow>
            <TableHead className="text-secondary font-medium w-[100px]">
              Дата
            </TableHead>
            <TableHead className="text-secondary font-medium w-[100px]">
              Время
            </TableHead>
            <TableHead className="text-secondary font-medium">Кто</TableHead>
            {activeTab !== "tool" && (
              <TableHead className="text-secondary font-medium">
                Кол-во
              </TableHead>
            )}
            <TableHead className="text-secondary font-medium">Откуда</TableHead>
            <TableHead className="text-secondary font-medium">Куда</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isError && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-red-500">
                Ошибка при загрузке, попробуйте позже
              </TableCell>
            </TableRow>
          )}
          {transferRecords.length === 0 && !isError && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-400">
                Нет записей
              </TableCell>
            </TableRow>
          )}
          {transferRecords.map((transfer) => (
            <TableRow key={transfer.id}>
              <TableCell>{formatDate(transfer.createdAt)}</TableCell>
              <TableCell>{formatTime(transfer.createdAt)}</TableCell>
              <TableCell>
                {`${transfer.movedBy.lastName} ${transfer.movedBy.firstName} `}
              </TableCell>
              {activeTab !== "tool" && (
                <TableCell>{transfer.quantity}</TableCell>
              )}

              <TableCell>
                {transfer.fromObject ? transfer.fromObject.name : "-"}
              </TableCell>
              <TableCell>{transfer.toObject.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
