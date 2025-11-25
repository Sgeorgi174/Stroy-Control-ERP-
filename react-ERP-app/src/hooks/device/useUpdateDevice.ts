import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateDevice } from "@/services/api/device.api";
import type { UpdateDeviceDto } from "@/types/dto/device.dto";
import type { AppAxiosError } from "@/types/error-response";

export const useUpdateDevice = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateDeviceDto) => updateDevice(id, dto),
    onSuccess: () => {
      toast.success("Устройство обновлено");
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось редактировать устройство";
      toast.error(message);
    },
  });
};
