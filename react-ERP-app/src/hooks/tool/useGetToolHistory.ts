import { getToolHistory } from "@/services/api/tool.api";
import { useQuery } from "@tanstack/react-query";

export const useGetToolHistory = (toolId: string) => {
  return useQuery({
    queryKey: ["tool-history", toolId],
    queryFn: () => getToolHistory(toolId),
  });
};
