import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createTool } from "@/services/api/tool.api"; // путь может отличаться
import type { CreateToolDto } from "@/types/dto/tool.dto";
import type { AppAxiosError } from "@/types/error-response";

export const useCreateTool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateToolDto) => createTool(data),
    onSuccess: (data) => {
      toast.success(`Инструмент «${data.name}» успешно создан`);
      queryClient.invalidateQueries({ queryKey: ["tools"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось создать инструмент";
      toast.error(message);
    },
  });
};
