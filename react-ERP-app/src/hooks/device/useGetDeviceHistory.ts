import { getDeviceHistory } from "@/services/api/device.api";
import { useQuery } from "@tanstack/react-query";

export const useGetDeviceHistory = (deviceId: string) => {
  return useQuery({
    queryKey: ["device-history"],
    queryFn: () => getDeviceHistory(deviceId),
  });
};
