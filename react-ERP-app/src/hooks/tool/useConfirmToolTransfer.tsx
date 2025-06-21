import { confirmToolTransfer } from "@/services/api/tool.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useConfirmToolTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => confirmToolTransfer(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      queryClient.invalidateQueries({ queryKey: ["tool", id] });
    },
  });
};
