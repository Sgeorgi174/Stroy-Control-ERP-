import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadgeRequests } from "../status-badge-requests";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ClothesRequest } from "@/types/clothes-request";
import {
  useClothingHeights,
  useClothingSizes,
  useFootwearSizes,
} from "@/hooks/clothes/useClothes";
import { useClothesRequest } from "@/hooks/clothes-request/useClothesRequest"; // Импортируем новый хук
import { Calendar, CheckCircle2, Hash, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/format-date";
import { RequestActionsDropdown } from "./request-clothes-dropdown";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { TransferToStorageDialog } from "./request-transfer-to-storage-dialog";

type RequestDetailsDialogProps = {
  selectedRequest: ClothesRequest | null;
  setSelectedRequest: React.Dispatch<
    React.SetStateAction<ClothesRequest | null>
  >;
};

export function RequestDetailsDialog({
  selectedRequest,
  setSelectedRequest,
}: RequestDetailsDialogProps) {
  // Подтягиваем актуальные данные с сервера
  const { data: request, isLoading: isRequestLoading } = useClothesRequest(
    selectedRequest?.id,
  );
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);

  const { data: clothesSizes = [] } = useClothingSizes();
  const { data: footwearSizes = [] } = useFootwearSizes();
  const { data: heights = [] } = useClothingHeights();

  if (!request) return null;

  if (!request && isRequestLoading) {
    return (
      <Dialog
        open={!!selectedRequest}
        onOpenChange={(open) => !open && setSelectedRequest(null)}
      >
        <DialogContent className="flex items-center justify-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </DialogContent>
      </Dialog>
    );
  }

  const totalItems =
    request.clothes?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <>
      <Dialog
        open={!!selectedRequest}
        onOpenChange={(open) => !open && setSelectedRequest(null)}
      >
        <DialogContent className="min-w-[1000px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between mt-5">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <DialogTitle className="text-2xl font-bold">
                  {request.title}
                </DialogTitle>
                {isRequestLoading && (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                )}
              </div>
              <div className="flex gap-5 items-center">
                <p className="text-sm text-muted-foreground">
                  {request.customer}
                </p>
                <StatusBadgeRequests status={request.status} />
                <p>{`Заявка №-${request.number.toString().padStart(5, "0")}`}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Передаем актуальный request для корректных действий в маппинге */}
              <RequestActionsDropdown request={request} />
            </div>
            <DialogDescription className="hidden" />
          </DialogHeader>

          <div className="grid grid-cols-1 gap-6 py-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">
                  Общая информация
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-6">
                  <div className="col-span-3 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Создана пользователем
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-sm px-3 py-1">
                        {request.createdBy.lastName}{" "}
                        {request.createdBy.firstName}
                      </Badge>
                    </div>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Дата добавления
                    </p>
                    <div className="flex gap-2 items-center text-sm font-medium">
                      <Calendar className="w-4 h-4 text-primary" />
                      {formatDate(request.createdAt)}
                    </div>
                  </div>

                  <div className="col-span-3 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Участники заявки
                    </p>
                    <div className="flex gap-2 flex-wrap max-h-32 overflow-y-auto pr-2">
                      {request.participants.map(
                        (user) =>
                          user && (
                            <Badge
                              key={user.id}
                              variant="outline"
                              className="text-sm px-3 py-1 bg-muted"
                            >
                              {user.lastName} {user.firstName}
                            </Badge>
                          ),
                      )}
                    </div>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Статистика позиций
                    </p>
                    <div className="flex gap-2 items-center text-sm font-medium">
                      <Hash className="w-4 h-4 text-primary" />
                      <span>Позиций: {request.clothes?.length}</span>
                      <span className="text-muted-foreground mx-1">/</span>
                      <span>Всего: {totalItems} шт.</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Позиции
                  </CardTitle>
                  {request.status === "COMPLETED" && (
                    <Button onClick={() => setIsTransferDialogOpen(true)}>
                      Переместить на склад
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {request.clothes?.length ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader className="">
                        <TableRow>
                          <TableHead className="w-[50px]">#</TableHead>
                          <TableHead>Наименование</TableHead>
                          <TableHead className="text-center">Кол-во</TableHead>
                          {request.status === "COMPLETED" && (
                            <TableHead className="text-center">
                              Принято
                            </TableHead>
                          )}
                          <TableHead>Сезон</TableHead>
                          <TableHead>Размер</TableHead>
                          <TableHead>Ростовка</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {request.clothes.map((item, index) => {
                          const isFullyTransferred =
                            item.quantity === item.transferredQuantity &&
                            item.quantity > 0;

                          const clothingSize =
                            clothesSizes.find(
                              (s) => s.id === item.clothingSizeId,
                            )?.size || "-";
                          const footwearSize =
                            footwearSizes.find(
                              (s) => s.id === item.footwearSizeId,
                            )?.size || "-";
                          const height =
                            heights.find((h) => h.id === item.clothingHeightId)
                              ?.height || "-";

                          return (
                            <TableRow key={index}>
                              <TableCell className="font-medium text-muted-foreground">
                                {isFullyTransferred ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                ) : (
                                  index + 1
                                )}
                              </TableCell>
                              <TableCell className="font-medium">
                                {item.name}
                              </TableCell>
                              <TableCell className="text-center font-bold">
                                {item.quantity}
                              </TableCell>
                              {request.status === "COMPLETED" && (
                                <TableCell className="text-center font-bold">
                                  {item.transferredQuantity}
                                </TableCell>
                              )}
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className="font-normal"
                                >
                                  {item.season === "SUMMER" ? "Лето" : "Зима"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {item.type === "CLOTHING"
                                  ? clothingSize
                                  : footwearSize}
                              </TableCell>
                              <TableCell>
                                {item.type === "CLOTHING" ? height : "-"}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground italic">
                    Позиции не добавлены
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-2 flex justify-end">
            <Button
              variant="secondary"
              onClick={() => setSelectedRequest(null)}
              className="px-8"
            >
              Закрыть
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {request && (
        <TransferToStorageDialog
          clothesSizes={clothesSizes}
          footwearSizes={footwearSizes}
          heights={heights}
          request={request}
          open={isTransferDialogOpen}
          onOpenChange={setIsTransferDialogOpen}
        />
      )}
    </>
  );
}
