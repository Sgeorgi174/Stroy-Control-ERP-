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
import { PendingTable } from "./pending-table";

type TransferHistoryTableProps = {
  transferRecords: TransferRecord[];
  isError: boolean;
  isLoading: boolean;
};

const actionMap = {
  ADD: "Пополнение",
  TRANSFER: "Перемещение",
  CONFIRM: "Приняли на объекте",
  GIVE_TO_EMPLOYEE: "Выдача",
  WRITTEN_OFF: "Списание",
};

export function TransferHistoryTable({
  transferRecords,
  isError,
  isLoading,
}: TransferHistoryTableProps) {
  console.log(transferRecords);

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
            {(activeTab === "clothing" || activeTab === "footwear") && (
              <TableHead className="text-secondary font-medium">
                Кол-во
              </TableHead>
            )}
            {(activeTab === "clothing" || activeTab === "footwear") && (
              <TableHead className="text-secondary font-medium">
                Действие
              </TableHead>
            )}
            <TableHead className="text-secondary font-medium">Откуда</TableHead>
            <TableHead className="text-secondary font-medium">Куда</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <PendingTable
            isError={isError}
            isLoading={isLoading}
            data={transferRecords}
            small={true}
          />
          {transferRecords.map((transfer) => (
            <TableRow key={transfer.id}>
              <TableCell>{formatDate(transfer.createdAt)}</TableCell>
              <TableCell>{formatTime(transfer.createdAt)}</TableCell>
              <TableCell>
                {`${transfer.movedBy.lastName} ${transfer.movedBy.firstName} `}
              </TableCell>
              {(activeTab === "clothing" || activeTab === "footwear") && (
                <TableCell>{transfer.quantity}</TableCell>
              )}

              {(activeTab === "clothing" || activeTab === "footwear") && (
                <TableCell>{actionMap[transfer.action]}</TableCell>
              )}

              <TableCell>
                {(transfer.fromObject && transfer.action === "TRANSFER") ||
                transfer.action === "CONFIRM"
                  ? transfer.fromObject.name
                  : "-"}
              </TableCell>
              <TableCell>
                {transfer.action === "TRANSFER" ? transfer.toObject.name : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
