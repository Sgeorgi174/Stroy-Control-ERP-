import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { addToolBagItem } from "@/services/api/tool.api";
import type { AddToolBagItemDto } from "@/types/dto/tool.dto";
import type { AppAxiosError } from "@/types/error-response";

export const useAddToolBagItem = (toolId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToolBagItemDto) => addToolBagItem(toolId, data),
    onSuccess: (data) => {
      toast.success(`Инструмент «${data.name}» успешно добавлен в сумку`);
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      queryClient.invalidateQueries({ queryKey: ["tool", toolId] });
      queryClient.invalidateQueries({ queryKey: ["tool-bag"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось обновить сумку";
      toast.error(message);
    },
  });
};
