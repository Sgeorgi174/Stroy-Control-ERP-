import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { confirmToolBulkTransfer } from "@/services/api/tool.api"; // путь может отличаться

import type { AppAxiosError } from "@/types/error-response";

export const useConfirmToolBulkTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transferId: string) => confirmToolBulkTransfer(transferId),
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
