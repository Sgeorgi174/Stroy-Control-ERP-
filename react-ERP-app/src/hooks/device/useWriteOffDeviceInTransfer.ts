import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";
import type { WirteOffDeviceInTransferDto } from "@/types/dto/device.dto";
import { writeOffDeviceInTransfer } from "@/services/api/device.api";

export const useWriteOffDeviceInTransfer = (transferId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WirteOffDeviceInTransferDto) =>
      writeOffDeviceInTransfer(transferId, data),
    onSuccess: () => {
      toast.success(`Вы успешно списали устройство`);
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось списать устройство";
      toast.error(message);
    },
  });
};
