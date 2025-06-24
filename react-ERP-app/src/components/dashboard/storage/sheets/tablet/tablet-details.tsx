import type { Tablet } from "@/types/tablet";
import { TabletDetailsBox } from "./tablet-details-box";
import { TabletHistoryTable } from "../../tables/tablets-history-table";
import { useGetTabletHistory } from "@/hooks/tablet/useGetTabletHistory";

type TabletDetailsProps = { tablet: Tablet };

export function TabletDetails({ tablet }: TabletDetailsProps) {
  const { data = [], isError, isLoading } = useGetTabletHistory(tablet.id);

  return (
    <>
      <div className="p-5 flex flex-col gap-1">
        <TabletDetailsBox tablet={tablet} />
        <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />
        <p className="text-center font-medium text-xl mt-5">
          Последние изменения
        </p>

        <TabletHistoryTable
          tabletHistoryRecords={data}
          isError={isError}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
