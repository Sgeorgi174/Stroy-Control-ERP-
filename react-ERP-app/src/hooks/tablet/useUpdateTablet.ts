import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { UpdateTabletDto } from "@/types/dto/tablet.dto";
import { updateTablet } from "@/services/api/tablet.api";
import type { AppAxiosError } from "@/types/error-response";

export const useUpdateTablet = (tabletId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTabletDto) => updateTablet(tabletId, data),
    onSuccess: (data) => {
      toast.success(`Планшет «${data.name}» успешно обновлён`);
      queryClient.invalidateQueries({ queryKey: ["tablets"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message ||
        "Не удалось обновить данные о планшете";
      toast.error(message);
    },
  });
};
