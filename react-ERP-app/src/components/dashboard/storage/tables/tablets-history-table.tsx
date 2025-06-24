import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tabletStatusMap } from "@/constants/tabletStatusMap";
import { formatDate, formatTime } from "@/lib/utils/format-date";
import type { TabletHistoryRecord } from "@/types/tabletHistoryRecord";
import { CommentPopover } from "./status-changes-table/comment-popover";
import { PendingTable } from "./pending-table";

type TabletHistoryTableProps = {
  tabletHistoryRecords: TabletHistoryRecord[];
  isError: boolean;
  isLoading: boolean;
};

export function TabletHistoryTable({
  tabletHistoryRecords,
  isError,
  isLoading,
}: TabletHistoryTableProps) {
  const isChangeStatus = (record: TabletHistoryRecord) =>
    record.toStatus || record.fromStatus;

  return (
    <div className="mt-6 rounded-lg border overflow-hidden">
      {" "}
      <Table>
        <TableHeader className="bg-primary pointer-events-none">
          <TableRow>
            <TableHead></TableHead>
            <TableHead className="text-secondary font-medium w-[70px]">
              Дата
            </TableHead>
            <TableHead className="text-secondary font-medium w-[70px]">
              Время
            </TableHead>
            <TableHead className="text-secondary font-medium w-[200px]">
              Кто
            </TableHead>
            <TableHead className="text-secondary font-medium w-[135px]">
              Действие
            </TableHead>
            <TableHead className="text-secondary font-medium">
              Старое значение
            </TableHead>
            <TableHead className="text-secondary font-medium">
              Новое значение
            </TableHead>
            <TableHead className="text-secondary font-medium ">
              Коментарий
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <PendingTable
            isError={isError}
            isLoading={isLoading}
            data={tabletHistoryRecords}
          />
          {tabletHistoryRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell></TableCell>
              <TableCell>{formatDate(record.createdAt)}</TableCell>
              <TableCell>{formatTime(record.createdAt)}</TableCell>
              <TableCell>
                {`${record.changedBy.lastName} ${record.changedBy.firstName} `}
              </TableCell>
              <TableCell className="font-medium">
                {!isChangeStatus(record) ? "Смена сотрудника" : "Смена статуса"}
              </TableCell>
              <TableCell>
                {isChangeStatus(record)
                  ? tabletStatusMap[record.fromStatus]
                  : record.fromEmployee
                  ? `${record.fromEmployee.lastName} ${record.fromEmployee.firstName}`
                  : "-"}
              </TableCell>
              <TableCell>
                {!isChangeStatus(record)
                  ? `${record.toEmployee.lastName} ${record.toEmployee.firstName}`
                  : tabletStatusMap[record.toStatus]}
              </TableCell>
              <TableCell>
                <CommentPopover comment={record.comment} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
