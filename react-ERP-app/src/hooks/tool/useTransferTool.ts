import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { transferTool } from "@/services/api/tool.api"; // путь подкорректируй
import type { TransferToolDto } from "@/types/dto/tool.dto";
import type { AppAxiosError } from "@/types/error-response";

export const useTransferTool = (toolId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TransferToolDto) => transferTool(toolId, data),
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
