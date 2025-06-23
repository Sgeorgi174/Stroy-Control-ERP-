import { useQuery } from "@tanstack/react-query";
import type { TabletStatus } from "@/types/tablet";
import { getFilteredTablets } from "@/services/api/tablet.api";

interface FilterParams {
  searchQuery: string;
  status?: TabletStatus | null;
}

export const useTablets = (params: FilterParams, enabled = true) => {
  return useQuery({
    queryKey: ["tablets", params],
    queryFn: () => getFilteredTablets(params),
    enabled,
  });
};
