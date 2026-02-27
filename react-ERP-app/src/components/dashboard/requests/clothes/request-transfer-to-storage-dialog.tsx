import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Warehouse, Check, AlertCircle } from "lucide-react";
import type { ClothesRequest } from "@/types/clothes-request";
import { toast } from "react-hot-toast";
import { useTransferToStorage } from "@/hooks/clothes-request/useClothesRequest";
import { useObjects } from "@/hooks/object/useObject";
import { ObjectSelectForForms } from "../../select-object-for-form";
import { cn } from "@/lib/utils";

type TransferToStorageDialogProps = {
  request: ClothesRequest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clothesSizes: { id: string; size: string }[];
  footwearSizes: { id: string; size: string }[];
  heights: { id: string; height: string }[];
};

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
      requestClothesId?: string; // Тот самый ID для подсветки
    };
  };
}

export function TransferToStorageDialog({
  request,
  open,
  onOpenChange,
  clothesSizes,
  footwearSizes,
  heights,
}: TransferToStorageDialogProps) {
  const [selectedObjectId, setSelectedObjectId] = useState<string>("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [errorItemId, setErrorItemId] = useState<string | null>(null);

  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });

  const transferMutation = useTransferToStorage(request.id);

  // Инициализация данных — добавлена опциональная цепочка ?.
  useEffect(() => {
    if (open) {
      const initial: Record<string, number> = {};
      request.clothes?.forEach((item) => {
        const remaining = item.quantity - item.transferredQuantity;
        initial[item.id] = remaining > 0 ? remaining : 0;
      });
      setQuantities(initial);
      setErrorItemId(null);
    }
  }, [open, request]);

  useEffect(() => {
    setErrorItemId(null);
  }, [selectedObjectId]);

  const handleTransfer = () => {
    if (!selectedObjectId) return toast.error("Выберите склад");
    setErrorItemId(null);

    const items = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => ({ requestClothesId: id, quantity: qty }));

    if (items.length === 0)
      return toast.error("Укажите количество для перевода");

    transferMutation.mutate(
      { objectId: selectedObjectId, items },
      {
        onSuccess: () => {
          toast.success("Позиции успешно приняты на склад");
          onOpenChange(false);
        },
        onError: (error: ApiErrorResponse) => {
          const problematicId = error?.response?.data?.requestClothesId;
          if (problematicId) {
            setErrorItemId(problematicId);
            toast.error(
              error?.response?.data?.message || "Карточка товара не найдена",
            );
          } else {
            toast.error("Произошла ошибка при перемещении");
          }
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[950px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Warehouse className="w-6 h-6 text-primary" />
            Приемка позиций на склад
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4 overflow-hidden flex flex-col flex-1">
          <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-lg border">
            <div className="space-y-1">
              <span className="text-sm font-semibold block">
                Склад назначения:
              </span>
            </div>
            <div className="flex-1 max-w-sm">
              <ObjectSelectForForms
                selectedObjectId={selectedObjectId}
                onSelectChange={(id) => setSelectedObjectId(id ?? "")}
                objects={objects}
              />
            </div>
          </div>

          <div className="rounded-md border overflow-y-auto flex-1">
            <Table>
              <TableHeader className="sticky top-0 bg-secondary z-10">
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Наименование</TableHead>
                  <TableHead>Сезон</TableHead>
                  <TableHead>Размер</TableHead>
                  <TableHead>Ростовка</TableHead>
                  <TableHead className="text-center">Доступно</TableHead>
                  <TableHead className="w-[120px] text-center">
                    Принять
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Рендеринг позиций — добавлена опциональная цепочка ?. */}
                {request.clothes?.map((item, index) => {
                  const remaining = item.quantity - item.transferredQuantity;
                  if (remaining <= 0) return null;

                  const isError = errorItemId === item.id;

                  const clothingSize =
                    clothesSizes.find((s) => s.id === item.clothingSizeId)
                      ?.size || "-";
                  const footwearSize =
                    footwearSizes.find((s) => s.id === item.footwearSizeId)
                      ?.size || "-";
                  const height =
                    heights.find((h) => h.id === item.clothingHeightId)
                      ?.height || "-";

                  return (
                    <TableRow
                      key={item.id}
                      className={cn(
                        "transition-colors",
                        isError &&
                          "bg-red-50/50 animate-in fade-in duration-300",
                      )}
                    >
                      <TableCell className="font-medium">
                        {isError ? (
                          <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />
                        ) : (
                          index + 1
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{item.name}</span>
                          {isError && (
                            <span className="text-[10px] text-red-600 font-semibold uppercase">
                              Нет карточки на складе
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {item.season === "SUMMER" ? "Лето" : "Зима"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.type === "CLOTHING" ? clothingSize : footwearSize}
                      </TableCell>
                      <TableCell>
                        {item.type === "CLOTHING" ? height : "-"}
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge variant="secondary">{remaining} шт.</Badge>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className={cn(
                            "h-8 text-center",
                            isError &&
                              "border-red-500 focus-visible:ring-red-400",
                          )}
                          value={quantities[item.id] || 0}
                          min={0}
                          max={remaining}
                          onChange={(e) => {
                            const val = Math.min(
                              Number(e.target.value),
                              remaining,
                            );
                            setQuantities((prev) => ({
                              ...prev,
                              [item.id]: val,
                            }));
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {/* Дополнительно: обработка пустого списка */}
            {!request.clothes?.length && (
              <div className="p-8 text-center text-muted-foreground italic">
                Нет доступных позиций для приемки
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={transferMutation.isPending}
          >
            Отмена
          </Button>
          <Button
            onClick={handleTransfer}
            disabled={transferMutation.isPending}
            className="bg-green-600 hover:bg-green-700 min-w-[180px]"
          >
            {transferMutation.isPending ? (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            ) : (
              <Check className="w-4 h-4 mr-2" />
            )}
            Подтвердить приемку
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
