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

type ToolsTableProps = {
  items: EmployeeClothingItem[];
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
        {items.length > 0 ? (
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
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">
                          {formatDate(clothing.issuedAt)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">
                          {clothing.clothing.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">
                          {clothing.priceWhenIssued}
                        </span>
                      </div>
                    </TableCell>
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
                        <div className="flex items-center">
                          <span className="text-xs text-green-600 font-medium">
                            Оплачено
                          </span>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <p className="text-gray-500 text-sm">Одежда не выдавалась</p>
        )}
      </CardContent>
    </Card>
  );
}
