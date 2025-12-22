import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shirt, Plus, MoreHorizontal, Minus, X, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils/format-date";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteCustomClothes } from "@/hooks/employee/useDeleteCustomClothes";
import { ConfirmDeleteCustomClothesDialog } from "./delete-custom-clothes-dialog";

type Props = {
  items: EmployeeClothingItem[];
  isLoading: boolean;
  isError: boolean;
  isWarning: boolean;
  onAddClick: () => void;
  onReduceDebt: (item: EmployeeClothingItem) => void;
  onWriteOffDebt: (item: EmployeeClothingItem) => void;
};

export function CustomClothesTable({
  items,
  isLoading,
  isError,
  isWarning,
  onAddClick,
  onReduceDebt,
  onWriteOffDebt,
}: Props) {
  const deleteMutation = useDeleteCustomClothes();
  const [deleteItem, setDeleteItem] = useState<EmployeeClothingItem | null>(
    null
  );

  return (
    <Card className={isWarning ? "bg-yellow-300/10" : ""}>
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shirt className="w-5 h-5" />
          Одежда добавленная вручную
        </CardTitle>

        <Button size="sm" variant="outline" onClick={onAddClick}>
          <Plus className="w-4 h-4 mr-1" />
          Добавить одежду
        </Button>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Загрузка...</p>
        ) : isError ? (
          <p className="text-sm text-destructive text-center">
            Ошибка загрузки данных
          </p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Одежда не добавлялась
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Наименование</TableHead>
                <TableHead>Размер</TableHead>
                <TableHead>Рост</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Долг</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>

            <TableBody>
              {items.map((item) => {
                const c = item.customClothes!;
                return (
                  <TableRow key={item.id}>
                    <TableCell>{formatDate(item.issuedAt)}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.size ?? "-"}</TableCell>
                    <TableCell>{c.height ?? "-"}</TableCell>
                    <TableCell>{item.priceWhenIssued}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          Number(item.debtAmount) > 0
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {item.debtAmount}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {Number(item.debtAmount) > 0 && (
                            <>
                              <DropdownMenuItem
                                onClick={() => onReduceDebt(item)}
                              >
                                <Minus className="mr-2 h-4 w-4" />
                                Частично погасить
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => onWriteOffDebt(item)}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Списать долг
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}

                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setDeleteItem(item)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Удалить
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <ConfirmDeleteCustomClothesDialog
        open={!!deleteItem}
        onOpenChange={() => setDeleteItem(null)}
        onConfirm={() => {
          if (!deleteItem) return;
          deleteMutation.mutate(deleteItem.id);
          setDeleteItem(null);
        }}
      />
    </Card>
  );
}
