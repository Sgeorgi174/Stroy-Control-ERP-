"use client";

import React from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { History, Package, FileText } from "lucide-react";
import type { SentItem, SentItemHistory } from "@/types/sent-item";
import { formatDate } from "@/lib/utils/format-date";

interface ItemDetailsSheetProps {
  item: SentItem | null;
  onClose: () => void;
  history?: SentItemHistory[];
  isHistoryLoading?: boolean;
}

function InfoField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p className="font-medium">{value || "—"}</p>
    </div>
  );
}

function getTypeBadgeVariant(type: string) {
  switch (type.toLowerCase()) {
    case "приход":
    case "in":
    case "add":
      return "default";
    case "расход":
    case "out":
    case "remove":
      return "destructive";
    default:
      return "secondary";
  }
}

export function ItemDetailsSheet({
  item,
  onClose,
  history,
  isHistoryLoading,
}: ItemDetailsSheetProps) {
  return (
    <Sheet open={!!item} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-xl overflow-y-auto p-4">
        {item && (
          <>
            <SheetHeader className="">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <SheetTitle className="text-xl">{item.name}</SheetTitle>
                  <p className="text-sm text-muted-foreground">
                    Добавлено{" "}
                    {new Date(item.addedDay).toLocaleDateString("ru-RU")}
                  </p>
                </div>
              </div>
            </SheetHeader>

            <div className="mt-8 space-y-6">
              {/* Основная информация */}
              <div className="grid grid-cols-2 gap-6">
                <InfoField
                  label="Количество"
                  value={
                    <span className="text-lg tabular-nums">
                      {item.quantity}
                    </span>
                  }
                />
                <InfoField
                  label="Цена"
                  value={
                    <span className="text-lg tabular-nums">
                      {item.price.toLocaleString("ru-RU")} ₽
                    </span>
                  }
                />
              </div>

              {item.desсription && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span className="text-xs uppercase tracking-wide">
                      Описание
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed bg-muted/50 rounded-lg p-3">
                    {item.desсription}
                  </p>
                </div>
              )}

              <Separator />

              {/* История изменений */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">История изменений</h3>
                </div>

                {isHistoryLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : !history || history.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg">
                    <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>История пуста</p>
                  </div>
                ) : (
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">Дата</TableHead>
                          <TableHead className="font-semibold">Тип</TableHead>
                          <TableHead className="font-semibold">
                            Кол-во
                          </TableHead>
                          <TableHead className="font-semibold">
                            Комментарий
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {history.map((h) => (
                          <TableRow key={h.id}>
                            <TableCell className="text-muted-foreground text-sm">
                              {formatDate(h.actionDate)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getTypeBadgeVariant(h.type)}>
                                {h.type === "ADD"
                                  ? "Пополнение"
                                  : h.type === "CREATE"
                                    ? "Добавление"
                                    : "Отправка"}
                              </Badge>
                            </TableCell>
                            <TableCell className="tabular-nums font-medium">
                              {h.quantity}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {h.comment || "—"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
