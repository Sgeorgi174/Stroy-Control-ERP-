import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteTablet } from "@/services/api/tablet.api";

export function useDeleteTablet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tabletId: string) => deleteTablet(tabletId),
    onSuccess: () => {
      toast.success("Планшет успешно удалён");
      queryClient.invalidateQueries({ queryKey: ["tablets"] });
    },
    onError: (error) => {
      console.error("Ошибка при удалении планшета:", error);
      toast.error("Не удалось удалить планшет");
    },
  });
}
