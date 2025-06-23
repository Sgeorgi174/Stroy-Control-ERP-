import { getToolStatusChangesHistory } from "@/services/api/tool.api";
import { useQuery } from "@tanstack/react-query";

export const useGetToolStatusChanges = (toolId: string) => {
  return useQuery({
    queryKey: ["tool-statuses"],
    queryFn: () => getToolStatusChangesHistory(toolId),
  });
};
