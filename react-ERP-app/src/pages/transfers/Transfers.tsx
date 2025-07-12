import { TransferSheet } from "@/components/dashboard/transfers/sheet/transfer-sheet/transfer-sheet";
import { TransferClothesCard } from "@/components/dashboard/transfers/transfers-cards/clothes-card";
import { TransferDeviceCard } from "@/components/dashboard/transfers/transfers-cards/device-card";
import { TransferToolCard } from "@/components/dashboard/transfers/transfers-cards/tool-card";
import { TransfersWrapper } from "@/components/dashboard/transfers/transfers-cards/transfers-wrapper";
import { TransfersFilter } from "@/components/dashboard/transfers/transfers-filter";
import { useGetTransfers } from "@/hooks/user/useGetAllTRansfers";
import { getLocalStartOfDayIso } from "@/lib/utils/getLocalDayIso";
import { useFilterPanelStore } from "@/stores/filter-panel-store";

export function Transfers() {
  const {
    selectedTransferDate,
    selectedTransferStatus,
    fromObjectId,
    toObjectId,
  } = useFilterPanelStore();

  const updatedAt = getLocalStartOfDayIso(selectedTransferDate);

  const { data = { tools: [], devices: [], clothes: [] } } = useGetTransfers({
    status: selectedTransferStatus,
    updatedAt: updatedAt,
    fromObjectId: fromObjectId,
    toObjectId: toObjectId,
  });

  return (
    <>
      <TransfersFilter />
      <TransfersWrapper>
        <TransferToolCard transferTools={data.tools} />
        <TransferDeviceCard transferDevices={data.devices} />
        <TransferClothesCard transferClothes={data.clothes} />
      </TransfersWrapper>

      <TransferSheet />
    </>
  );
}
