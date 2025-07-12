import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { returnToolToSource } from "@/services/api/tool.api";
import type { AppAxiosError } from "@/types/error-response";

export const useReturnToolToSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transferId: string) => returnToolToSource(transferId),
    onSuccess: () => {
      toast.success(`Вы успешно переотправили инструмент`);
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message ||
        "Не удалось создать новое перемещение";
      toast.error(message);
    },
  });
};
