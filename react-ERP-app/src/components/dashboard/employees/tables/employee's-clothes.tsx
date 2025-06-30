import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { EmployeeClothingItem } from "@/types/employeesClothing";
import { PendingTable } from "../../storage/tables/pending-table";
import { formatDate } from "@/lib/utils/format-date";
import { EllipsisVertical } from "lucide-react";

type ToolsTableProps = {
  items: EmployeeClothingItem[];
  isLoading: boolean;
  isError: boolean;
};

export function EmployeeClothesTable({
  items,
  isLoading,
  isError,
}: ToolsTableProps) {
  return (
    <div className="mt-6 rounded-lg border overflow-hidden">
      <Table>
        <TableHeader className="bg-primary pointer-events-none">
          <TableRow>
            <TableHead className="text-secondary font-bold">Дата</TableHead>
            <TableHead className="text-secondary font-bold">
              Наименование
            </TableHead>
            <TableHead className="text-secondary font-bold w-[150px]">
              Сезон
            </TableHead>
            <TableHead className="text-secondary font-bold w-[120px]">
              Цена
            </TableHead>
            <TableHead className="text-secondary font-bold w-[120px]">
              Остаток
            </TableHead>
            <TableHead className="text-secondary font-bold"></TableHead>

            <TableHead className="text-secondary font-bold"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <PendingTable isError={isError} isLoading={isLoading} data={items} />
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                {formatDate(item.issuedAt)}
              </TableCell>
              <TableCell>{item.clothing.name}</TableCell>
              <TableCell>
                {item.clothing.season === "SUMMER" ? "Лето" : "Зима"}
              </TableCell>
              <TableCell>{item.priceWhenIssued}</TableCell>
              <TableCell>{item.debtAmount}</TableCell>
              <TableCell>
                <EllipsisVertical />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
