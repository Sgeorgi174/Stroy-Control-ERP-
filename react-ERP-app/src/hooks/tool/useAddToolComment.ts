import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { addToolComment } from "@/services/api/tool.api"; // путь может отличаться
import type { AddToolCommentDto } from "@/types/dto/tool.dto";
import type { AppAxiosError } from "@/types/error-response";

export const useAddToolComment = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToolCommentDto) => addToolComment(id, data),
    onSuccess: () => {
      toast.success(`Коментарий успешно создан`);
      queryClient.invalidateQueries({ queryKey: ["tools"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось создать коментарий";
      toast.error(message);
    },
  });
};
