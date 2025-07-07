import type { Clothes } from "@/types/clothes";
import { useGetClothesHistory } from "@/hooks/clothes/useClothes";
import { ClothesDetailsBox } from "./clothes-details-box";
import { ClothesHistory } from "./clothes-history";

export function ClothesDetails({ clothes }: { clothes: Clothes }) {
  const {
    data: clothesHistoryData = [],
    isError,
    isLoading,
  } = useGetClothesHistory(clothes.id);

  return (
    <>
      <div className="p-5 flex flex-col gap-1">
        <ClothesDetailsBox clothes={clothes} />
        <p className="font-medium text-xl mt-6">История</p>
        <ClothesHistory
          transferRecords={clothesHistoryData}
          isError={isError}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
