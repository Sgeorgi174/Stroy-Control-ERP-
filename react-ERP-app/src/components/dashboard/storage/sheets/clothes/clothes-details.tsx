import type { Clothes } from "@/types/clothes";
import { TransferHistoryTable } from "../../tables/transfer-history-table";
import { useGetClothesHistory } from "@/hooks/clothes/useClothes";
import { ClothesDetailsBox } from "./clothes-details-box";

export function ClothesDetails({ clothes }: { clothes: Clothes }) {
  const {
    data: clothesHistoryData = [],
    isError,
    isLoading,
  } = useGetClothesHistory(clothes.id);

  console.log(clothesHistoryData);

  return (
    <>
      <div className="p-5 flex flex-col gap-1">
        <ClothesDetailsBox clothes={clothes} />
        <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />
        <p className="text-center font-medium text-xl mt-5">
          Последние изменения
        </p>
        <TransferHistoryTable
          transferRecords={clothesHistoryData}
          isError={isError}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
