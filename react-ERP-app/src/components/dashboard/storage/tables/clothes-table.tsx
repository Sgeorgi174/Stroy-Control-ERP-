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
import { TabletSkeleton } from "../../tablet-skeleton";

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
            <TableHead className="w-[30px]"></TableHead>
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
          {isError && <TableRow></TableRow>}
          {isLoading && <TabletSkeleton />}
          {clothes.map((item) => (
            <TableRow key={item.id}>
              <TableCell></TableCell>
              <TableCell
                className="font-medium hover:underline cursor-pointer"
                onClick={() => openSheet("details", item)}
              >
                {item.name}
              </TableCell>
              <TableCell>{item.size}</TableCell>
              <TableCell>
                {item.season === "SUMMER" ? "Лето" : "Зима"}
              </TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.inTransit}</TableCell>
              <TableCell>{item.storage.name}</TableCell>
              <TableCell>
                <ClothesDropdown clothes={item} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
