import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { cancelToolTransfer } from "@/services/api/tool.api";
import type { AppAxiosError } from "@/types/error-response";
import type { CancelToolTransferDto } from "@/types/dto/tool.dto";

export const useCancelToolTransfer = (transferId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CancelToolTransferDto) =>
      cancelToolTransfer(transferId, data),
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
