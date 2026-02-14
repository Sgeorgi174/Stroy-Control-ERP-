// ClothesRequestsTable.tsx
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { ClothesRequest } from "@/types/clothes-request";
import {
  useClothingHeights,
  useClothingSizes,
  useFootwearSizes,
} from "@/hooks/clothes/useClothes";

type Props = {
  data: ClothesRequest[];
  isLoading: boolean;
};

export function ClothesRequestsTable({ data, isLoading }: Props) {
  const [selectedRequest, setSelectedRequest] = useState<ClothesRequest | null>(
    null,
  );
  const { data: clothesSizes = [] } = useClothingSizes();
  const { data: footwearSizes = [] } = useFootwearSizes();
  const { data: heights = [] } = useClothingHeights();

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Заказчик</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Создана</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((req) => (
            <TableRow
              key={req.id}
              className="cursor-pointer hover:bg-muted"
              onClick={() => setSelectedRequest(req)}
            >
              <TableCell>{req.title}</TableCell>
              <TableCell>{req.customer}</TableCell>
              <TableCell>{req.status}</TableCell>
              <TableCell>
                {new Date(req.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Модал с деталями заявки */}
      {selectedRequest && (
        <Dialog
          open={!!selectedRequest}
          onOpenChange={() => setSelectedRequest(null)}
        >
          <DialogContent className="min-w-[1000px]">
            <h2 className="text-lg font-semibold mb-4">
              {selectedRequest.title}
            </h2>
            <div className="mb-2">
              <b>Заказчик:</b> {selectedRequest.customer}
            </div>
            <div className="mb-2">
              <b>Статус:</b> {selectedRequest.status}
            </div>

            <div className="mb-4">
              <b>Участники:</b>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedRequest.participants.map((u) => (
                  <Badge key={u.id} variant="secondary">
                    {u.lastName} {u.firstName}
                  </Badge>
                ))}
              </div>
            </div>

            {selectedRequest.clothes?.length ? (
              <div>
                <b>Позиции:</b>
                <Table className="mt-2">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                      <TableHead>Количество</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Сезон</TableHead>
                      <TableHead>Размер</TableHead>
                      <TableHead>Ростовка</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedRequest.clothes.map((item, index) => {
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
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            {item.type === "CLOTHING" ? "Одежда" : "Обувь"}
                          </TableCell>
                          <TableCell>
                            {item.season === "SUMMER" ? "Лето" : "Зима"}
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
            ) : null}

            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 rounded bg-muted hover:bg-muted/80"
                onClick={() => setSelectedRequest(null)}
              >
                Закрыть
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
