import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeForeman } from "@/services/api/object.api";
import type { ChangeForemanDto } from "@/types/dto/object.dto";
import toast from "react-hot-toast";

export const useChangeForeman = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChangeForemanDto) => changeForeman(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["objects"] });
      toast.success(`На объекте «${data.name}» успешно изменен бригадир`);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Не удалось сменить бригадира";
      toast.error(message);
    },
  });
};
