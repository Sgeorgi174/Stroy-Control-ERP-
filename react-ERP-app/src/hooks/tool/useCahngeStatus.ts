import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateToolStatus } from "@/services/api/tool.api"; // путь подкорректируй
import type { UpdateToolStatusDto } from "@/types/dto/tool.dto";
import type { AppAxiosError } from "@/types/error-response";

export const useChangeToolStatus = (toolId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateToolStatusDto) => updateToolStatus(toolId, data),
    onSuccess: () => {
      toast.success("Статус успешно изменён");
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      queryClient.invalidateQueries({ queryKey: ["tool", toolId] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось изменить статус";
      toast.error(message);
    },
  });
};
