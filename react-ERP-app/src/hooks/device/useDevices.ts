import { useQuery } from "@tanstack/react-query";
import { getFilteredDevice } from "@/services/api/device.api";
import type { DeviceStatus } from "@/types/device";

interface FilterParams {
  searchQuery: string;
  objectId?: string | null;
  status?: DeviceStatus | null;
  includeAllStatuses?: "true" | "false";
}

export const useDevices = (params: FilterParams, enabled = true) => {
  return useQuery({
    queryKey: ["devices", params],
    queryFn: () => getFilteredDevice(params),
    enabled,
  });
};
