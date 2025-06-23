import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { TransferTabletDto } from "@/types/dto/tablet.dto";
import { transferTablet } from "@/services/api/tablet.api";

export const useChangeEmployee = (tabletId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TransferTabletDto) => transferTablet(tabletId, data),
    onSuccess: () => {
      toast.success("Планшет успешно передан другому сотруднику");
      queryClient.invalidateQueries({ queryKey: ["tablets"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Не удалось передать планшет";
      toast.error(message);
    },
  });
};
