import { useClothesRequests } from "@/hooks/clothes-request/useClothesRequest";
import { CreateClothesRequestDialog } from "./create-request-clothes-dialog";
import { ClothesRequestsTable } from "./request-clothes-table";

export function RequestClothesTab() {
  const { data = [], isLoading } = useClothesRequests();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Заявки на спецодежду</h1>
        <CreateClothesRequestDialog />
      </div>

      <ClothesRequestsTable data={data} isLoading={isLoading} />
    </div>
  );
}
