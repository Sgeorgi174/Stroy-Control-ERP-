import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { confirmToolTransfer } from "@/services/api/tool.api"; // путь может отличаться

import type { AppAxiosError } from "@/types/error-response";

export const useConfirmToolTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transferId: string) => confirmToolTransfer(transferId),
    onSuccess: () => {
      toast.success(`Перемещение успешно подтверждено`);
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось подтвердить перемещение";
      toast.error(message);
    },
  });
};
