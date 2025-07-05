import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { requestToolPhotoByTransferId } from "@/services/api/tool.api"; // путь может отличаться
import type { AppAxiosError } from "@/types/error-response";

export const useRequestToolPhoto = () => {
  return useMutation({
    mutationFn: (transferId: string) =>
      requestToolPhotoByTransferId(transferId),
    onSuccess: () => {
      toast.success(`Бот ожидает фото инструмента`);
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось инициализировать бота";
      toast.error(message);
    },
  });
};
