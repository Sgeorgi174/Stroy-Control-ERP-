import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateDeviceStatus } from "@/services/api/device.api";
import type { UpdateDeviceStatusDto } from "@/types/dto/device.dto";
import type { AppAxiosError } from "@/types/error-response";

export const useChangeDeviceStatus = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateDeviceStatusDto) => updateDeviceStatus(id, dto),
    onSuccess: () => {
      toast.success("Статус устройства обновлён");
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message ||
        "Не удалось обновить статус устройства";
      toast.error(message);
    },
  });
};
