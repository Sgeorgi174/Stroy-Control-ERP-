import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";
import { resendDeviceTransfer } from "@/services/api/device.api";
import type { ResendDeviceTransferDto } from "@/types/dto/device.dto";

export const useResendDeviceTransfer = (transferId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ResendDeviceTransferDto) =>
      resendDeviceTransfer(transferId, data),
    onSuccess: () => {
      toast.success(`Вы успешно переотправили устройство`);
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message ||
        "Не удалось создать новое перемещение";
      toast.error(message);
    },
  });
};
