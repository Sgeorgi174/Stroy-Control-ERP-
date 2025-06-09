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

type ClothesTableProps = {
  clothes: Clothes[];
};

export function ClothesTable({ clothes }: ClothesTableProps) {
  return (
    <Table className="mt-6">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Наименование</TableHead>
          <TableHead>Размер</TableHead>
          <TableHead>Сезон</TableHead>
          <TableHead>В наличии</TableHead>
          <TableHead>В пути</TableHead>
          <TableHead>Место хранения</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clothes.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>{item.size}</TableCell>
            <TableCell>{item.season === "SUMMER" ? "Лето" : "Зима"}</TableCell>
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
  );
}
