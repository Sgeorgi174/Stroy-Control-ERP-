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
import { useRowColors } from "@/hooks/useRowColor";
import { ClothingPDFButton } from "../pdf-generate/clothing/clothing-pdf-generate";
import { useFilterPanelStore } from "@/stores/filter-panel-store";
import { useMemo } from "react";
import { sortClothes } from "@/lib/utils/clothes-sort";

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
  const { colors, setColor, resetColor } = useRowColors("clothes");
  const { selectedObjectId } = useFilterPanelStore();

  function getRowBgColor(
    quantity: number,
    storageName: string,
    customColor?: string,
  ): string | undefined {
    if (storageName === "Главный склад") {
      if (quantity <= 2) return "bg-table-red";
      if (quantity < 5) return "bg-table-orange";
      return customColor;
    }

    if (storageName === "Полимет-Инжиниринг") {
      if (quantity < 2) return "bg-table-red";
      return customColor;
    }

    return customColor;
  }

  const sortedClothes = useMemo(() => sortClothes(clothes), [clothes]);

  console.log(sortedClothes);

  return (
    <>
      <div className="bg-muted p-2 pl-4 rounded-xl mt-5 flex items-center gap-10">
        {/* Всего сотрудников */}
        <p>
          Всего:{" "}
          <span className="font-medium">
            {clothes.reduce((acc, e) => acc + e.quantity, 0)}
          </span>
        </p>
      </div>
      <div className="mt-6 rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-primary">
            <TableRow>
              <TableHead className=" text-secondary font-bold">
                Наименование
              </TableHead>
              <TableHead className="text-secondary font-bold ">
                Размер
              </TableHead>
              <TableHead className="text-secondary font-bold ">
                Ростовка
              </TableHead>
              <TableHead className="text-secondary font-bold ">Сезон</TableHead>
              <TableHead className="text-secondary font-bold ">
                В наличии
              </TableHead>
              <TableHead className="text-secondary font-bold ">
                В пути
              </TableHead>
              <TableHead className="text-secondary font-bold">
                Место хранения
              </TableHead>
              <TableHead className="text-secondary font-bold">
                Поставщик
              </TableHead>
              <TableHead className="text-secondary font-bold">Статус</TableHead>
              <TableHead className="text-secondary font-bold">
                {selectedObjectId !== "all" && (
                  <ClothingPDFButton clothes={clothes} />
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <PendingTable
              isError={isError}
              isLoading={isLoading}
              data={clothes}
            />
            {sortedClothes.map((item) => {
              const rowBg = getRowBgColor(
                item.quantity,
                item.storage.name,
                colors[item.id],
              );

              return (
                <TableRow
                  key={item.id}
                  onClick={() => openSheet("details", item)}
                >
                  <TableCell className="font-medium hover:underline">
                    {item.name}
                  </TableCell>
                  <TableCell>
                    {item.type === "CLOTHING"
                      ? item.clothingSize.size
                      : item.footwearSize.size}
                  </TableCell>
                  <TableCell>
                    {item.type === "CLOTHING"
                      ? item.clothingHeight.height
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {item.season === "SUMMER" ? "Лето" : "Зима"}
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    {item.inTransit.reduce(
                      (acc, curr) => acc + curr.quantity,
                      0,
                    )}
                  </TableCell>
                  <TableCell>{item.storage.name}</TableCell>
                  <TableCell>{item.provider.name}</TableCell>
                  <TableCell>
                    <div
                      className={[
                        "cursor-pointer",
                        "w-[20px]",
                        "rounded-xl",
                        "h-[20px]",
                        rowBg,
                        rowBg && `hover:${rowBg}`,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    ></div>
                  </TableCell>
                  <TableCell>
                    <div onClick={(e) => e.stopPropagation()}>
                      <ClothesDropdown
                        clothes={item}
                        setColor={setColor}
                        resetColor={resetColor}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
