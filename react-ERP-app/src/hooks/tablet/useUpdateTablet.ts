import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { Tablet } from "@/types/tablet";
import type { UpdateTabletDto } from "@/types/dto/tablet.dto";
import { updateTablet } from "@/services/api/tablet.api";

export const useUpdateTablet = (tabletId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Tablet, unknown, UpdateTabletDto>({
    mutationFn: (data) => updateTablet(tabletId, data),
    onSuccess: (data) => {
      toast.success(`Планшет «${data.name}» успешно обновлён`);
      queryClient.invalidateQueries({ queryKey: ["tablets"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        "Не удалось обновить данные о планшете";
      toast.error(message);
    },
  });
};
