import { useQuery } from "@tanstack/react-query";
import { getFilteredTools } from "@/services/api/tool.api";
import type { ToolStatus } from "@/types/tool";

type Params = {
  searchQuery: string;
  objectId?: string | null;
  status?: ToolStatus | null;
  isBulk: boolean;
  includeAllStatuses?: "true" | "false";
};

export const useTools = (params: Params, enabled = true) => {
  return useQuery({
    queryKey: ["tools", params],
    queryFn: () => getFilteredTools(params),
    enabled, // для подстраховки
  });
};
