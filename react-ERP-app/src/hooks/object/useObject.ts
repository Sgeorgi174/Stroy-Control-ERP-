import { useQuery } from "@tanstack/react-query";
import { getFilteredObjects } from "@/services/api/object.api";
import type { ObjectStatus } from "@/types/object";

interface FilterParams {
  searchQuery: string;
  status?: ObjectStatus | null;
}

export const useObjects = (params: FilterParams, enabled = true) => {
  return useQuery({
    queryKey: ["objects", params],
    queryFn: () => getFilteredObjects(params),
    enabled,
  });
};
