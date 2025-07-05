import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { rejectToolTransfer } from "@/services/api/tool.api"; // путь может отличаться

import type { AppAxiosError } from "@/types/error-response";
import type { RejectToolDto } from "@/types/dto/tool.dto";

export const useRejectToolTransfer = (transferId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RejectToolDto) => rejectToolTransfer(transferId, data),
    onSuccess: () => {
      toast.success(`Вы успешно отклонили перемещение`);
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось отклонить перемещение";
      toast.error(message);
    },
  });
};
