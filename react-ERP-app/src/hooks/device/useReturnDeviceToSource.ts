import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";
import { returnDeviceToSource } from "@/services/api/device.api";

export const useReturnDeviceToSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transferId: string) => returnDeviceToSource(transferId),
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
