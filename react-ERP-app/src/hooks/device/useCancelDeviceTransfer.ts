import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";
import type { CancelDeviceTransferDto } from "@/types/dto/device.dto";
import { cancelDeviceTransfer } from "@/services/api/device.api";

export const useCancelDeviceTransfer = (transferId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CancelDeviceTransferDto) =>
      cancelDeviceTransfer(transferId, data),
    onSuccess: () => {
      toast.success(`Перемещение успешно отменено`);
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось отменить перемещение";
      toast.error(message);
    },
  });
};
