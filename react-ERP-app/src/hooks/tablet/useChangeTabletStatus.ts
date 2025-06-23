import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { UpdateTabletStatusDto } from "@/types/dto/tablet.dto";
import { updateTabletStatus } from "@/services/api/tablet.api";

export const useChangeTabletStatus = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateTabletStatusDto) => updateTabletStatus(id, dto),
    onSuccess: () => {
      toast.success("Статус планшета обновлён");

      queryClient.invalidateQueries({ queryKey: ["tablets"] });
    },
    onError: () => toast.error("Не удалось обновить статус планшета"),
  });
};
