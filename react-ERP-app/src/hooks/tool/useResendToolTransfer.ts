import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { resendToolTransfer } from "@/services/api/tool.api";
import type { AppAxiosError } from "@/types/error-response";
import type { ResendToolTransferDto } from "@/types/dto/tool.dto";

export const useResendToolTransfer = (transferId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ResendToolTransferDto) =>
      resendToolTransfer(transferId, data),
    onSuccess: () => {
      toast.success(`Вы успешно переотправили инструмент`);
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
