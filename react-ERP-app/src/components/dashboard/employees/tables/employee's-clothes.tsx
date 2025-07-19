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
import { Minus, MoreHorizontal, Shirt, X } from "lucide-react";
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

type ToolsTableProps = {
  items: EmployeeClothingItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
  handleWriteOffDebt: (clothing: EmployeeClothingItem) => void;
  handleReduceDebt: (clothing: EmployeeClothingItem) => void;
};

export function EmployeeClothesTable({
  items,
  isLoading,
  isError,
  handleReduceDebt,
  handleWriteOffDebt,
}: ToolsTableProps) {
  return (
    <Card>
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
                <TableHead>Одежда</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Остаток долга</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((clothing) => {
                const remainingDebt = clothing.debtAmount;

                return (
                  <TableRow key={clothing.id}>
                    <TableCell>{formatDate(clothing.issuedAt)}</TableCell>
                    <TableCell>{clothing.clothing.name}</TableCell>
                    <TableCell>{clothing.priceWhenIssued}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          remainingDebt > 0
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {remainingDebt}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {remainingDebt > 0 ? (
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
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <span className="text-xs text-green-600 font-medium">
                          Оплачено
                        </span>
                      )}
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
