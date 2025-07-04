import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";
import { activateObject } from "@/services/api/user.api";

export const useActivateObject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activateObject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["status-object"] });
      toast.success(`Объект успешно принят`);
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось принять объект";
      toast.error(message);
    },
  });
};
