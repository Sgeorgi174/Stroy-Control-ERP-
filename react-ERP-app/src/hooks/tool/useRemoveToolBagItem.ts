import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { removeToolBagItem } from "@/services/api/tool.api";
import type { RemoveToolBagItemDto } from "@/types/dto/tool.dto";
import type { AppAxiosError } from "@/types/error-response";

export const useRemoveToolBagItem = (itemId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RemoveToolBagItemDto) => removeToolBagItem(itemId, data),
    onSuccess: (data) => {
      toast.success(`Инструмент «${data.name}» успешно удален из  сумки`);
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      queryClient.invalidateQueries({ queryKey: ["tool-bag"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось обновить сумку";
      toast.error(message);
    },
  });
};
