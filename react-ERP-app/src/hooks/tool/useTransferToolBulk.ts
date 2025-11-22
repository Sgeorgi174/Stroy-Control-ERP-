import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { transferToolBulk } from "@/services/api/tool.api"; // путь подкорректируй
import type { TransferToolBulkDto } from "@/types/dto/tool.dto";
import type { AppAxiosError } from "@/types/error-response";

export const useTransferToolBulk = (toolId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TransferToolBulkDto) => transferToolBulk(toolId, data),
    onSuccess: () => {
      toast.success("Инструмент успешно перемещён");
      queryClient.invalidateQueries({ queryKey: ["tools"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось переместить инструмент";
      toast.error(message);
    },
  });
};
