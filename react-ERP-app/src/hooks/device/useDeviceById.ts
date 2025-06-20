import { useQuery } from "@tanstack/react-query";
import { getDeviceById } from "@/services/api/device.api";

export const useDeviceById = (id: string) => {
  return useQuery({
    queryKey: ["device", id],
    queryFn: () => getDeviceById(id),
    enabled: !!id,
  });
};
