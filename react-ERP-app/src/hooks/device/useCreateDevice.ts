import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createDevice } from "@/services/api/device.api";
import type { CreateDeviceDto } from "@/types/dto/device.dto";

export const useCreateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateDeviceDto) => createDevice(dto),
    onSuccess: () => {
      toast.success("Устройство успешно добавлено");
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
    onError: () => toast.error("Не удалось добавить устройство"),
  });
};
