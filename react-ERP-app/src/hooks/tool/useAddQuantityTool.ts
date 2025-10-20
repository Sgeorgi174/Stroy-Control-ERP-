import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { addQuantityTool } from "@/services/api/tool.api";
import type { AddQuantityTool } from "@/types/dto/tool.dto";
import type { AppAxiosError } from "@/types/error-response";

export const useAddQuantityTool = (toolId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddQuantityTool) => addQuantityTool(toolId, data),
    onSuccess: (data) => {
      toast.success(`Инструмент «${data.name}» успешно пополнен`);
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      queryClient.invalidateQueries({ queryKey: ["tool", toolId] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось пополнить инструмент";
      toast.error(message);
    },
  });
};
