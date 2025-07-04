import { TransferClothesCard } from "@/components/dashboard/transfers/transfers-cards/clothes-card";
import { TransferDeviceCard } from "@/components/dashboard/transfers/transfers-cards/device-card";
import { TransferToolCard } from "@/components/dashboard/transfers/transfers-cards/tool-card";
import { TransfersWrapper } from "@/components/dashboard/transfers/transfers-cards/transfers-wrapper";
import { useGetAllTransfers } from "@/hooks/user/useGetAllTRansfers";

export function Transfers() {
  const { data = { tools: [], devices: [], clothes: [] } } =
    useGetAllTransfers();

  return (
    <TransfersWrapper>
      <TransferToolCard transferTools={data.tools} />
      <TransferDeviceCard transferDevices={data.devices} />
      <TransferClothesCard transferClothes={data.clothes} />
    </TransfersWrapper>
  );
}
