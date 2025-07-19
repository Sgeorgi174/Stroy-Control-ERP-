import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClothesDropdown } from "../dropdowns/clothes-dropdown";
import type { Clothes } from "@/types/clothes";
import { useClothesSheetStore } from "@/stores/clothes-sheet-store";
import { PendingTable } from "./pending-table";

type ClothesTableProps = {
  clothes: Clothes[];
  isLoading: boolean;
  isError: boolean;
};

export function ClothesTable({
  clothes,
  isLoading,
  isError,
}: ClothesTableProps) {
  const { openSheet } = useClothesSheetStore();

  return (
    <div className="mt-6 rounded-lg border overflow-hidden">
      <Table>
        <TableHeader className="bg-primary pointer-events-none">
          <TableRow>
            <TableHead className=" text-secondary font-bold">
              Наименование
            </TableHead>
            <TableHead className="text-secondary font-bold ">Размер</TableHead>
            <TableHead className="text-secondary font-bold ">Сезон</TableHead>
            <TableHead className="text-secondary font-bold ">
              В наличии
            </TableHead>
            <TableHead className="text-secondary font-bold ">В пути</TableHead>
            <TableHead className="text-secondary font-bold">
              Место хранения
            </TableHead>
            <TableHead className="text-secondary font-bold"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <PendingTable
            isError={isError}
            isLoading={isLoading}
            data={clothes}
          />
          {clothes.map((item) => (
            <TableRow
              key={item.id}
              onClick={() => openSheet("details", item)}
              className="cursor-pointer"
            >
              <TableCell className="font-medium hover:underline">
                {item.name}
              </TableCell>
              <TableCell>{item.size}</TableCell>
              <TableCell>
                {item.season === "SUMMER" ? "Лето" : "Зима"}
              </TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>
                {item.inTransit.reduce((acc, curr) => acc + curr.quantity, 0)}
              </TableCell>
              <TableCell>{item.storage.name}</TableCell>
              <TableCell>
                <div onClick={(e) => e.stopPropagation()}>
                  <ClothesDropdown clothes={item} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
