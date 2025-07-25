import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateTool } from "@/services/api/tool.api";
import type { UpdateToolDto } from "@/types/dto/tool.dto";
import type { AppAxiosError } from "@/types/error-response";

export const useUpdateTool = (toolId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateToolDto) => updateTool(toolId, data),
    onSuccess: (data) => {
      toast.success(`Инструмент «${data.name}» успешно обновлён`);
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      queryClient.invalidateQueries({ queryKey: ["tool", toolId] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось обновить инструмент";
      toast.error(message);
    },
  });
};
