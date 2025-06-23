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
import { TabletSkeleton } from "../../tablet-skeleton";

type TabletsTableProps = {
  tablets: Tablet[];
  isLoading: boolean;
  isError: boolean;
};

const tabletStatusMap = {
  ACTIVE: "Активен",
  INACTIVE: "Свободен",
  IN_REPAIR: "На ремонте",
  LOST: "Утерян",
  WRITTEN_OFF: "Списан",
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
          {isError && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-red-500">
                Ошибка при загрузке, попробуйте позже
              </TableCell>
            </TableRow>
          )}
          {tablets.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-400">
                Ничего не найдено
              </TableCell>
            </TableRow>
          )}
          {isLoading && <TabletSkeleton />}
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
              <TableCell>{tabletStatusMap[tablet.status]}</TableCell>
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
