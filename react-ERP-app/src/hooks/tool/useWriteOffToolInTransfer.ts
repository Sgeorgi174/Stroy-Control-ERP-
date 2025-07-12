import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { writeOffToolInTransfer } from "@/services/api/tool.api";

import type { AppAxiosError } from "@/types/error-response";
import type { WirteOffToolInTransferDto } from "@/types/dto/tool.dto";

export const useWriteOffToolInTransfer = (transferId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WirteOffToolInTransferDto) =>
      writeOffToolInTransfer(transferId, data),
    onSuccess: () => {
      toast.success(`Вы успешно списали инструмент`);
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось списать инструмент";
      toast.error(message);
    },
  });
};
