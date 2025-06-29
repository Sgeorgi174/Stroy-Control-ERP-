import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { CreateTabletDto } from "@/types/dto/tablet.dto";
import { createTablet } from "@/services/api/tablet.api";
import type { AppAxiosError } from "@/types/error-response";

export const useCreateTablet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTabletDto) => createTablet(data),
    onSuccess: (data) => {
      toast.success(`Планшет «${data.name}» успешно создан`);
      queryClient.invalidateQueries({ queryKey: ["tablets"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось создать новый планшет";
      toast.error(message);
    },
  });
};
