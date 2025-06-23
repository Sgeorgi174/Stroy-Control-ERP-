import type { Tablet } from "@/types/tablet";
import { TransferHistoryTable } from "../../tables/transfer-history-table";
import { TabletDetailsBox } from "./tablet-details-box";

type TabletDetailsProps = { tablet: Tablet };

export function TabletDetails({ tablet }: TabletDetailsProps) {
  return (
    <>
      <div className="p-5 flex flex-col gap-1">
        <TabletDetailsBox tablet={tablet} />
        <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />
        <p className="text-center font-medium text-xl mt-5">
          Последние перемещения
        </p>
        <TransferHistoryTable />
      </div>
    </>
  );
}
