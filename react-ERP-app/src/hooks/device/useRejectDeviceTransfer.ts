import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";
import type { RejectDeviceDto } from "@/types/dto/device.dto";
import { rejectDeviceTransfer } from "@/services/api/device.api";

export const useRejectDeviceTransfer = (transferId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RejectDeviceDto) =>
      rejectDeviceTransfer(transferId, data),
    onSuccess: () => {
      toast.success(`Вы успешно отклонили перемещение`);
      queryClient.invalidateQueries({ queryKey: ["user-notifications"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось отклонить перемещение";
      toast.error(message);
    },
  });
};
