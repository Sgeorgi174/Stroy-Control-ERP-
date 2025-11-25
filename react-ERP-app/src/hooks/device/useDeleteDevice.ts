import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteDevice } from "@/services/api/device.api";
import type { AppAxiosError } from "@/types/error-response";

export const useDeleteDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDevice(id),
    onSuccess: () => {
      toast.success("Устройство удалено");
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось удалить устройство";
      toast.error(message);
    },
  });
};
