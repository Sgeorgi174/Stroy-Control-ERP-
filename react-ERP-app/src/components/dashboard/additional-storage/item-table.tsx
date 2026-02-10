"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Package,
  PackageOpen,
  MoreHorizontal,
  Eye,
  Pencil,
  PackagePlus,
  Send,
} from "lucide-react";
import type { SentItem } from "@/types/sent-item";

type ItemAction = "view" | "edit" | "restock" | "send";

interface ItemsTableProps {
  items: SentItem[];
  isLoading: boolean;
  onItemAction: (item: SentItem, action: ItemAction) => void;
}

export function ItemsTable({
  items,
  isLoading,
  onItemAction,
}: ItemsTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-muted p-4 mb-4">
            <PackageOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-center">
            На этом складе пока нет позиций
          </p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Добавьте первый товар, нажав кнопку выше
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg font-medium">
            Товары на складе
          </CardTitle>
          <span className="ml-auto text-sm text-muted-foreground">
            {"Всего :"} {items.length}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold">Название</TableHead>
                <TableHead className="font-semibold">Описание</TableHead>
                <TableHead className="font-semibold">Количество</TableHead>
                <TableHead className="font-semibold">Цена</TableHead>
                <TableHead className=""></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className="group">
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="font-medium text-muted-foreground">
                    {item.desсription}
                  </TableCell>
                  <TableCell className="">{item.quantity}</TableCell>
                  <TableCell className="">
                    {item.price.toLocaleString("ru-RU")} ₽
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Действия</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onItemAction(item, "view")}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Открыть
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onItemAction(item, "edit")}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onItemAction(item, "restock")}
                        >
                          <PackagePlus className="h-4 w-4 mr-2" />
                          Пополнить
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onItemAction(item, "send")}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Отправить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
