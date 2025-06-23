import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toolStatusMap } from "@/constants/toolStatusMap";
import { formatDate, formatTime } from "@/lib/utils/format-date";
import { CommentPopover } from "./comment-popover";
import type { StatusChangesRecord } from "@/types/historyRecords";

type StatusChangesHistoryTableProps = {
  statusChangesRecords: StatusChangesRecord[];
  isError: boolean;
};

export function StatusChangesHistoryTable({
  statusChangesRecords,
  isError,
}: StatusChangesHistoryTableProps) {
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
            <TableHead className="text-secondary font-medium">
              Старый статус
            </TableHead>
            <TableHead className="text-secondary font-medium">
              Новый статус
            </TableHead>
            <TableHead className="text-secondary font-medium ">
              Коментарий
            </TableHead>
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
          {statusChangesRecords.length === 0 && !isError && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-400">
                Нет записей
              </TableCell>
            </TableRow>
          )}
          {statusChangesRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{formatDate(record.createdAt)}</TableCell>
              <TableCell>{formatTime(record.createdAt)}</TableCell>
              <TableCell>
                {`${record.changedBy.lastName} ${record.changedBy.firstName} `}
              </TableCell>
              <TableCell>{toolStatusMap[record.fromStatus]}</TableCell>
              <TableCell>{toolStatusMap[record.toStatus]}</TableCell>
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
