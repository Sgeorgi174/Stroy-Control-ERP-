// hooks/object/useUpdateObject.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateObject } from "@/services/api/object.api";
import type { UpdateObjectDto } from "@/types/dto/object.dto";
import toast from "react-hot-toast";

export const useUpdateObject = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateObjectDto) => updateObject(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["objects"] });
      toast.success(`объект «${data.name}» успешно обновлён`);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        "Не удалось обновить данные о планшете";
      toast.error(message);
    },
  });
};
