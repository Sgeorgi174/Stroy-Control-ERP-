import { getTabletHistory } from "@/services/api/tablet.api";
import { useQuery } from "@tanstack/react-query";

export const useGetTabletHistory = (tabletId: string) => {
  return useQuery({
    queryKey: ["tablet-history", tabletId],
    queryFn: () => getTabletHistory(tabletId),
  });
};
