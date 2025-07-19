import { TransferSheet } from "@/components/dashboard/transfers/sheet/transfer-sheet/transfer-sheet";
import { TransferClothesCard } from "@/components/dashboard/transfers/transfers-cards/clothes-card";
import { TransferDeviceCard } from "@/components/dashboard/transfers/transfers-cards/device-card";
import { TransferToolCard } from "@/components/dashboard/transfers/transfers-cards/tool-card";
import { TransfersWrapper } from "@/components/dashboard/transfers/transfers-cards/transfers-wrapper";
import { TransfersFilter } from "@/components/dashboard/transfers/transfers-filter";
import { useGetTransfers } from "@/hooks/user/useGetAllTRansfers";
import { getLocalStartOfDayIso } from "@/lib/utils/getLocalDayIso";
import { useFilterPanelStore } from "@/stores/filter-panel-store";
import { Skeleton } from "@/components/ui/skeleton";

export function Transfers() {
  const {
    selectedTransferDate,
    selectedTransferStatus,
    fromObjectId,
    toObjectId,
  } = useFilterPanelStore();

  const updatedAt = getLocalStartOfDayIso(selectedTransferDate);

  const {
    data = { tools: [], devices: [], clothes: [] },
    isLoading,
    isError,
  } = useGetTransfers({
    status: selectedTransferStatus,
    updatedAt: updatedAt,
    fromObjectId: fromObjectId,
    toObjectId: toObjectId,
  });

  return (
    <>
      <TransfersFilter />
      <TransfersWrapper>
        {isLoading ? (
          <>
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </>
        ) : isError ? (
          <p className="text-center text-sm text-destructive col-span-3">
            Не удалось загрузить данные о перемещениях.
          </p>
        ) : data.tools.length === 0 &&
          data.devices.length === 0 &&
          data.clothes.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground col-span-3">
            Перемещений не найдено.
          </p>
        ) : (
          <>
            <TransferToolCard transferTools={data.tools} />
            <TransferDeviceCard transferDevices={data.devices} />
            <TransferClothesCard transferClothes={data.clothes} />
          </>
        )}
      </TransfersWrapper>

      <TransferSheet />
    </>
  );
}
