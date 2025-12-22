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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Minus, X, Undo2, Shirt } from "lucide-react";
import { formatDate } from "@/lib/utils/format-date";
import { ReturnClothingDialog } from "../return-clothing-dialog";
import type { Object } from "@/types/object";

type Props = {
  items: EmployeeClothingItem[];
  isLoading: boolean;
  isError: boolean;
  isWarning: boolean;
  employeeId: string;
  objects: Object[];
  openDialogId: string | null;
  setOpenDialogId: (id: string | null) => void;
  onReturn: (dto: {
    clothesId: string;
    employeeClothingId: string;
    employeeId: string;
    objectId: string;
  }) => void;
  onReduceDebt: (item: EmployeeClothingItem) => void;
  onWriteOffDebt: (item: EmployeeClothingItem) => void;
};

export function StockClothesTable({
  items,
  isLoading,
  isError,
  isWarning,
  objects,
  openDialogId,
  setOpenDialogId,
  onReturn,
  onReduceDebt,
  onWriteOffDebt,
}: Props) {
  return (
    <Card className={isWarning ? "bg-yellow-300/10" : ""}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Shirt className="w-5 h-5" />
          Одежда со склада
        </CardTitle>
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
            Одежда не выдавалась
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
                const clothing = item.clothing!;
                const isOpen = openDialogId === item.id;

                return (
                  <TableRow key={item.id}>
                    <TableCell>{formatDate(item.issuedAt)}</TableCell>
                    <TableCell>{clothing.name}</TableCell>
                    <TableCell>
                      {clothing.type === "CLOTHING"
                        ? clothing.clothingSize?.size ?? "-"
                        : clothing.footwearSize?.size ?? "-"}
                    </TableCell>
                    <TableCell>
                      {clothing.type === "CLOTHING"
                        ? clothing.clothingHeight?.height ?? "-"
                        : "-"}
                    </TableCell>
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
                      {Number(item.debtAmount) > 0 ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => onReduceDebt(item)}
                            >
                              <Minus className="mr-2 h-4 w-4" />
                              Частично погасить
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => onWriteOffDebt(item)}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Списать долг
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setOpenDialogId(item.id)}
                            >
                              <Undo2 className="mr-2 h-4 w-4" />
                              Возврат
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <span className="text-xs text-green-600">Оплачено</span>
                      )}

                      <ReturnClothingDialog
                        open={isOpen}
                        setOpen={setOpenDialogId}
                        clothingId={clothing.id}
                        employeeClothingId={item.id}
                        employeeId={item.employeeId}
                        objects={objects}
                        onReturn={onReturn}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
