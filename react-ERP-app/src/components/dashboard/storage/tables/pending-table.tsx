import { TableCell, TableRow } from "@/components/ui/table";
import { TableSkeleton } from "../../table-skeleton";
import type { Tool } from "@/types/tool";
import type { Clothes } from "@/types/clothes";
import type { Device } from "@/types/device";
import type { Tablet } from "@/types/tablet";
import type { Object } from "@/types/object";
import type { Employee } from "@/types/employee";
import type {
  StatusChangesRecord,
  TransferRecord,
} from "@/types/historyRecords";
import type { TabletHistoryRecord } from "@/types/tabletHistoryRecord";
import type { EmployeeClothingItem } from "@/types/employeesClothing";

type PendingTableProps = {
  data:
    | Tool[]
    | Clothes[]
    | Device[]
    | Tablet[]
    | Object[]
    | Employee[]
    | TransferRecord[]
    | TabletHistoryRecord[]
    | StatusChangesRecord[]
    | EmployeeClothingItem[];
  isError: boolean;
  isLoading: boolean;
  small?: boolean;
};

export function PendingTable({
  isLoading,
  isError,
  data,
  small,
}: PendingTableProps) {
  return (
    <>
      {isLoading && <TableSkeleton small={small} />}
      {isError && (
        <TableRow>
          <TableCell colSpan={7} className="text-center text-red-500">
            Ошибка при загрузке, попробуйте позже
          </TableCell>
        </TableRow>
      )}
      {data.length === 0 && !isLoading && !isError && (
        <TableRow>
          <TableCell colSpan={7} className="text-center text-gray-400">
            Ничего не найдено
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
