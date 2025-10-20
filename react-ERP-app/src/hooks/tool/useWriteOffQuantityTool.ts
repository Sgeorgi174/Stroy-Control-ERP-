import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { writeOffQuantityTool } from "@/services/api/tool.api";
import type { WriteOffQuantityTool } from "@/types/dto/tool.dto";
import type { AppAxiosError } from "@/types/error-response";

export const useWriteOffQuantityTool = (toolId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WriteOffQuantityTool) =>
      writeOffQuantityTool(toolId, data),
    onSuccess: (data) => {
      toast.success(`Инструмент «${data.name}» успешно списан`);
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      queryClient.invalidateQueries({ queryKey: ["tool", toolId] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось списать инструмент";
      toast.error(message);
    },
  });
};
