import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteTool } from "@/services/api/tool.api";

export function useDeleteTool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (toolId: string) => deleteTool(toolId),
    onSuccess: () => {
      toast.success("Инструмент успешно удалён");
      queryClient.invalidateQueries({ queryKey: ["tools"] });
    },
    onError: (error) => {
      console.error("Ошибка при удалении инструмента:", error);
      toast.error("Не удалось удалить инструмент");
    },
  });
}
