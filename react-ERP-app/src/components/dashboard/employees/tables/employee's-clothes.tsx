"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { EmployeeClothingItem } from "@/types/employeesClothing";
import { formatDate } from "@/lib/utils/format-date";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, MoreHorizontal, Shirt, Undo2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useObjects } from "@/hooks/object/useObject";
import { useReturnFromEmployee } from "@/hooks/clothes/useClothes";
import { ReturnClothingDialog } from "../return-clothing-dialog";

type ToolsTableProps = {
  items: EmployeeClothingItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
  isWarning: boolean;
  handleWriteOffDebt: (clothing: EmployeeClothingItem) => void;
  handleReduceDebt: (clothing: EmployeeClothingItem) => void;
};

export function EmployeeClothesTable({
  items,
  isLoading,
  isError,
  isWarning,
  handleReduceDebt,
  handleWriteOffDebt,
}: ToolsTableProps) {
  const objectsQuery = useObjects({ searchQuery: "", status: "OPEN" });
  const objects = objectsQuery.data || [];
  const returnMutation = useReturnFromEmployee();

  const handleReturn = (dto: {
    clothesId: string;
    employeeClothingId: string;
    employeeId: string;
    objectId: string;
  }) => {
    returnMutation.mutate(dto);
  };

  // Состояние для открытия диалога по каждому элементу одежды
  const [openDialogId, setOpenDialogId] = React.useState<string | null>(null);

  return (
    <Card className={`${isWarning ? "bg-yellow-300/10" : ""}`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Shirt className="w-5 h-5" />
          Выданная одежда
        </CardTitle>
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
        ) : items && items.length > 0 ? (
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
                      {" "}
                      {clothing.clothing.type === "CLOTHING"
                        ? clothing.clothing.clothingSize.size
                        : clothing.clothing.footwearSize.size}
                    </TableCell>
                    <TableCell>
                      {" "}
                      {clothing.clothing.type === "CLOTHING"
                        ? clothing.clothing.clothingHeight.height
                        : ""}
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
                              <Minus className="mr-2 h-4 w-4" />
                              Частично погасить
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleWriteOffDebt(clothing)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <X className="mr-2 h-4 w-4" />
                              Списать долг
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={clothing.isReturned}
                              onClick={(e) => {
                                e.preventDefault(); // не закрываем дропдаун
                                setOpenDialogId(clothing.id);
                              }}
                            >
                              <Undo2 className="mr-2 h-4 w-4" />
                              Возврат
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <span className="text-xs text-green-600 font-medium">
                          Оплачено
                        </span>
                      )}

                      {/* Диалог возврата */}
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
