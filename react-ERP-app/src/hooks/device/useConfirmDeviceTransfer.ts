import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";
import { confirmDeviceTransfer } from "@/services/api/device.api";

export const useConfirmDeviceTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transferId: string) => confirmDeviceTransfer(transferId),
    onSuccess: () => {
      toast.success(`Перемещение успешно подтверждено`);
      queryClient.invalidateQueries({ queryKey: ["user-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["user-returns"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось подтвердить перемещение";
      toast.error(message);
    },
  });
};
