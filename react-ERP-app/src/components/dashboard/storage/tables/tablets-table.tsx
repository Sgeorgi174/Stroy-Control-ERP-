import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Tablet } from "@/types/tablet";
import { TabletsDropDown } from "../dropdowns/tablets-dropdown";
import { useTabletSheetStore } from "@/stores/tablet-sheet-store";
import { PendingTable } from "./pending-table";
import { StatusBadge } from "./status-badge";
import { statusMap } from "@/constants/statusMap";

type TabletsTableProps = {
  tablets: Tablet[];
  isLoading: boolean;
  isError: boolean;
};

export function TabletsTable({
  tablets,
  isLoading,
  isError,
}: TabletsTableProps) {
  const { openSheet } = useTabletSheetStore();

  return (
    <div className="mt-6 rounded-lg border overflow-hidden">
      <Table>
        <TableHeader className="bg-primary pointer-events-none">
          <TableRow>
            <TableHead className="w-[30px]"></TableHead>
            <TableHead className="text-secondary font-bold">
              Серийный №
            </TableHead>
            <TableHead className="text-secondary font-bold">
              Наименование
            </TableHead>
            <TableHead className="text-secondary font-bold">Статус</TableHead>
            <TableHead className="text-secondary font-bold">
              Сотрудник
            </TableHead>
            <TableHead className="text-secondary font-bold">Телефон</TableHead>

            <TableHead className="text-secondary font-bold"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <PendingTable
            isError={isError}
            isLoading={isLoading}
            data={tablets}
          />
          {tablets.map((tablet) => (
            <TableRow key={tablet.id}>
              <TableCell></TableCell>
              <TableCell className="font-medium">
                {tablet.serialNumber}
              </TableCell>
              <TableCell
                onClick={() => openSheet("details", tablet)}
                className="hover:underline cursor-pointer"
              >
                {tablet.name}
              </TableCell>
              <TableCell>
                <StatusBadge
                  color={statusMap[tablet.status]?.color}
                  Icon={statusMap[tablet.status]?.icon}
                  text={statusMap[tablet.status]?.label}
                />
              </TableCell>
              <TableCell>
                {tablet.employee
                  ? `${tablet.employee.lastName} ${tablet.employee.firstName}`
                  : "Не назначен"}
              </TableCell>
              <TableCell>
                {tablet.employee ? tablet.employee.phoneNumber : "-"}
              </TableCell>
              <TableCell>
                <TabletsDropDown tablet={tablet} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
