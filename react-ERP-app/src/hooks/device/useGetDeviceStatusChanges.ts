import { getDeviceStatusChangesHistory } from "@/services/api/device.api";
import { useQuery } from "@tanstack/react-query";

export const useGetDeviceStatusChanges = (deviceId: string) => {
  return useQuery({
    queryKey: ["device-statuses", deviceId],
    queryFn: () => getDeviceStatusChangesHistory(deviceId),
  });
};
