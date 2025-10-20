import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteToolComment } from "@/services/api/tool.api"; // путь может отличаться
import type { AppAxiosError } from "@/types/error-response";

export const useDeleteToolComment = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteToolComment(id),
    onSuccess: () => {
      toast.success(`Коментарий успешно удален`);
      queryClient.invalidateQueries({ queryKey: ["tools"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось удалить коментарий";
      toast.error(message);
    },
  });
};
