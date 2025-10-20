import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateToolComment } from "@/services/api/tool.api"; // путь может отличаться
import type { AddToolCommentDto } from "@/types/dto/tool.dto";
import type { AppAxiosError } from "@/types/error-response";

export const useUpdateToolComment = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToolCommentDto) => updateToolComment(id, data),
    onSuccess: () => {
      toast.success(`Коментарий успешно обновлен`);
      queryClient.invalidateQueries({ queryKey: ["tools"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось обновить коментарий";
      toast.error(message);
    },
  });
};
