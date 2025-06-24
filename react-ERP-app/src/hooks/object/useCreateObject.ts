import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createObject } from "@/services/api/object.api";
import toast from "react-hot-toast";
import type { CreateObjectDto } from "@/types/dto/object.dto";

export const useCreateObject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateObjectDto) => createObject(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["objects"] });
      toast.success(`Объект «${data.name}» успешно создан`);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Не удалось создать новый объект";
      toast.error(message);
    },
  });
};
