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
import { StatusBadgeRequests } from "../status-badge-requests";
import type { ClothesRequest } from "@/types/clothes-request";
import { RequestDetailsDialog } from "./request-details-dialog";

type Props = {
  data: ClothesRequest[];
  isLoading: boolean;
};

export function ClothesRequestsTable({ data, isLoading }: Props) {
  const [selectedRequest, setSelectedRequest] = useState<ClothesRequest | null>(
    null,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-muted-foreground">
          Загрузка заявок...
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground mb-2">Заявки не найдены</p>
        <p className="text-sm text-muted-foreground">
          Создайте новую заявку на одежду для начала работы
        </p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Дата</TableHead>
            <TableHead>№ заявки</TableHead>
            <TableHead>Название</TableHead>
            <TableHead>Заказчик</TableHead>
            <TableHead>Статус</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((req) => (
            <TableRow
              key={req.id}
              className="cursor-pointer hover:bg-muted"
              onClick={() => setSelectedRequest(req)}
            >
              <TableCell>
                {new Date(req.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>{req.number.toString().padStart(5, "0")}</TableCell>
              <TableCell className="font-medium">{req.title}</TableCell>
              <TableCell>{req.customer}</TableCell>
              <TableCell>
                <StatusBadgeRequests status={req.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Модал с деталями заявки */}
      {selectedRequest && (
        <RequestDetailsDialog
          selectedRequest={selectedRequest}
          setSelectedRequest={setSelectedRequest}
        />
      )}
    </>
  );
}
