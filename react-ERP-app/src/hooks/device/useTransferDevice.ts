import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { transferDevice } from "@/services/api/device.api";
import type { TransferDeviceDto } from "@/types/dto/device.dto";
import type { AppAxiosError } from "@/types/error-response";

export const useTransferDevice = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: TransferDeviceDto) => transferDevice(id, dto),
    onSuccess: () => {
      toast.success("Устройство передано");
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось переместить устройство";
      toast.error(message);
    },
  });
};
