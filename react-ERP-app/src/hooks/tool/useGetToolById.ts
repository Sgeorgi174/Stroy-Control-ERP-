import { useQuery } from "@tanstack/react-query";
import { getToolById } from "@/services/api/tool.api";

export const useGetToolById = (toolId: string, enabled = true) => {
  return useQuery({
    queryKey: ["tool-bag"],
    queryFn: () => getToolById(toolId),
    enabled,
  });
};
