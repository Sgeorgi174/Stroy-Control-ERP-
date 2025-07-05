import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";
import { requestDevicePhotoByTransferId } from "@/services/api/device.api";

export const useRequestDevicePhoto = () => {
  return useMutation({
    mutationFn: (transferId: string) =>
      requestDevicePhotoByTransferId(transferId),
    onSuccess: () => {
      toast.success(`Бот ожидает фото устройства`);
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось инициализировать бота";
      toast.error(message);
    },
  });
};
