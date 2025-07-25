import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeForeman } from "@/services/api/object.api";
import toast from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";

export const useRemoveForeman = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => removeForeman(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["objects"] });
      toast.success(`На объекте «${data.name}» бригадир успешно снят`);
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось снять бригадира";
      toast.error(message);
    },
  });
};
