import type { EmployeeClothingItem } from "@/types/employeesClothing";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shirt, MoreHorizontal, Minus, X, Undo2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ReturnClothingDialog } from "../return-clothing-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils/format-date";
import type { Object } from "@/types/object";

type ClothesTableProps = {
  title: string;
  items: EmployeeClothingItem[];
  isLoading: boolean;
  isError: boolean;
  isWarning: boolean;
  employeeId: string;
  objects: Object[];
  openDialogId: string | null;
  setOpenDialogId: React.Dispatch<React.SetStateAction<string | null>>;
  handleReturn: (dto: {
    clothesId: string;
    employeeClothingId: string;
    employeeId: string;
    objectId: string;
  }) => void;
  handleReduceDebt: (clothing: EmployeeClothingItem) => void;
  handleWriteOffDebt: (clothing: EmployeeClothingItem) => void;
  isCustom?: boolean;
  onAddClick?: () => void;
};

export function ClothesTable({
  title,
  items,
  isLoading,
  isError,
  isWarning,
  objects,
  openDialogId,
  setOpenDialogId,
  handleReturn,
  handleReduceDebt,
  handleWriteOffDebt,
  isCustom = false,
  onAddClick,
}: ClothesTableProps) {
  return (
    <Card className={`${isWarning ? "bg-yellow-300/10" : ""}`}>
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shirt className="w-5 h-5" />
          {title}
        </CardTitle>
        {isCustom && onAddClick && (
          <Button
            size="sm"
            variant="outline"
            onClick={onAddClick}
            className="flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Добавить одежду
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-full rounded" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive text-center">
            Ошибка загрузки данных
          </p>
        ) : items.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата выдачи</TableHead>
                <TableHead>Наименование</TableHead>
                <TableHead>Размер</TableHead>
                <TableHead>Ростовка</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Остаток долга</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((clothing) => {
                const remainingDebt = clothing.debtAmount;
                const isDialogOpen = openDialogId === clothing.id;

                return (
                  <TableRow key={clothing.id}>
                    <TableCell>{formatDate(clothing.issuedAt)}</TableCell>
                    <TableCell>{clothing.clothing.name}</TableCell>
                    <TableCell>
                      {clothing.clothing.type === "CLOTHING"
                        ? clothing.clothing.clothingSize?.size ?? "-"
                        : clothing.clothing.footwearSize?.size ?? "-"}
                    </TableCell>
                    <TableCell>
                      {clothing.clothing.type === "CLOTHING"
                        ? clothing.clothing.clothingHeight?.height ?? "-"
                        : "-"}
                    </TableCell>
                    <TableCell>{clothing.priceWhenIssued}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          Number(remainingDebt) > 0
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {remainingDebt}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      {Number(remainingDebt) > 0 ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-48">
                            <DropdownMenuItem
                              onClick={() => handleReduceDebt(clothing)}
                            >
                              <Minus className="mr-2 h-4 w-4" /> Частично
                              погасить
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleWriteOffDebt(clothing)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <X className="mr-2 h-4 w-4" /> Списать долг
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={clothing.isReturned}
                              onClick={(e) => {
                                e.preventDefault();
                                setOpenDialogId(clothing.id);
                              }}
                            >
                              <Undo2 className="mr-2 h-4 w-4" /> Возврат
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <span className="text-xs text-green-600 font-medium">
                          Оплачено
                        </span>
                      )}

                      <ReturnClothingDialog
                        open={isDialogOpen}
                        setOpen={setOpenDialogId}
                        clothingId={clothing.clothing.id}
                        employeeClothingId={clothing.id}
                        employeeId={clothing.employeeId}
                        objects={objects}
                        onReturn={handleReturn}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <p className="text-gray-500 text-sm text-center py-8">
            Одежда не выдавалась
          </p>
        )}
      </CardContent>
    </Card>
  );
}
