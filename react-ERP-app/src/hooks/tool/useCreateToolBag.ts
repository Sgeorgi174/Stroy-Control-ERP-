import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createToolBag } from "@/services/api/tool.api"; // путь может отличаться
import type { CreateToolDto } from "@/types/dto/tool.dto";
import type { AppAxiosError } from "@/types/error-response";

export const useCreateToolBag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateToolDto) => createToolBag(data),
    onSuccess: () => {
      toast.success(`Сумка расключника успешно создана`);
      queryClient.invalidateQueries({ queryKey: ["tools"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось создать новую сумку";
      toast.error(message);
    },
  });
};
