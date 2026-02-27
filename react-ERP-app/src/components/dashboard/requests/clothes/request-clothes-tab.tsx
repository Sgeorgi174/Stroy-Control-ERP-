import { useState } from "react";
import { useClothesRequests } from "@/hooks/clothes-request/useClothesRequest";
import { ClothesRequestsTable } from "./request-clothes-table";
import { Button } from "@/components/ui/button";
import { ClothesRequestDialog } from "./create-request-clothes-dialog";

export function RequestClothesTab() {
  const { data = [], isLoading } = useClothesRequests();

  // Состояние для управления диалогом (создание новой заявки)
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Заявки на спецодежду</h1>

        {/* Кнопка открытия для СОЗДАНИЯ (initialData не передаем) */}
        <Button onClick={() => setIsCreateOpen(true)}>Создать заявку</Button>
      </div>

      <ClothesRequestsTable data={data} isLoading={isLoading} />

      {/* Сам компонент диалога для создания */}
      <ClothesRequestDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        initialData={null}
      />
    </div>
  );
}
