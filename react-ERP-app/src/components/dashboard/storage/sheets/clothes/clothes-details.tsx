import type { Clothes } from "@/types/clothes";
import { TransferHistoryTable } from "../../tables/transfer-history-table";

export function ClothesDetails({ clothes }: { clothes: Clothes }) {
  return (
    <>
      <div className="p-5 flex flex-col gap-1">
        <p>
          Наименование: <span className="font-medium">{clothes.name}</span>
        </p>
        <p>
          Размер: <span className="font-medium">{clothes.size}</span>
        </p>
        <p>
          Сезон:{" "}
          <span className="font-medium">
            {clothes.season === "SUMMER" ? "Лето" : "Зима"}
          </span>
        </p>
        <p>
          Количество: <span className="font-medium">{clothes.quantity}</span>
        </p>
        <p>
          В пути: <span className="font-medium">{clothes.inTransit}</span>
        </p>
        <p>
          Место хранения:{" "}
          <span className="font-medium">{clothes.storage.name}</span>
        </p>
        <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />
        <p className="text-center font-medium text-xl mt-5">
          Последние перемещения
        </p>
        <TransferHistoryTable />
      </div>
    </>
  );
}
