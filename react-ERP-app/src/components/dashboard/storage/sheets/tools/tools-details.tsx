import type { Tool } from "@/types/tool";
import { ToolsDetailsBox } from "./tool-details-box";
import { useGetToolHistory } from "@/hooks/tool/useGetToolHistory";
import { useGetToolStatusChanges } from "@/hooks/tool/useGetToolStatusChanges";
import { ToolTransferHistory } from "./tool-tranfer-history";
import { ToolsStatusHistory } from "./tool-status-history";

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
        <p className="font-medium text-xl mt-6">История</p>
        <ToolTransferHistory
          transferRecords={toolHistoryData}
          isError={toolHistoryError}
          isLoading={toolHistoryLoading}
        />
        <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />
        <ToolsStatusHistory
          statusChangesRecords={toolStatusChangesData}
          isError={toolStatusChangesError}
          isLoading={toolStatusChangesLoading}
        />
      </div>
    </>
  );
}
