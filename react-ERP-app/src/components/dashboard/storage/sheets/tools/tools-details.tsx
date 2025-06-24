import type { Tool } from "@/types/tool";
import { TransferHistoryTable } from "../../tables/transfer-history-table";
import { ToolsDetailsBox } from "./tool-details-box";
import { useGetToolHistory } from "@/hooks/tool/useGetToolHistory";
import { useGetToolStatusChanges } from "@/hooks/tool/useGetToolStatusChanges";
import { StatusChangesHistoryTable } from "../../tables/status-changes-table/status-changes-table";

type ToolsDetailsProps = {
  tool: Tool;
};

export function ToolsDetails({ tool }: ToolsDetailsProps) {
  const {
    data: toolHistoryData = [],
    isError: toolHistoryError,
    isLoading: toolHistoryLoading,
  } = useGetToolHistory(tool.id);
  const {
    data: toolStatusChangesData = [],
    isError: toolStatusChangesError,
    isLoading: toolStatusChangesLoading,
  } = useGetToolStatusChanges(tool.id);

  return (
    <>
      <div className="p-5 flex flex-col gap-1">
        <ToolsDetailsBox tool={tool} />
        <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />
        <p className="text-center font-medium text-xl mt-8">
          Последние перемещения
        </p>
        <TransferHistoryTable
          transferRecords={toolHistoryData}
          isError={toolHistoryError}
          isLoading={toolHistoryLoading}
        />
        <p className="text-center font-medium text-xl mt-8">Смены статусов</p>
        <StatusChangesHistoryTable
          statusChangesRecords={toolStatusChangesData}
          isError={toolStatusChangesError}
          isLoading={toolStatusChangesLoading}
        />
      </div>
    </>
  );
}
