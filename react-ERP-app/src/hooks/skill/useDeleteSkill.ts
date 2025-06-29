// hooks/object/useDeleteObject.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteSkill } from "@/services/api/skill";
import type { AppAxiosError } from "@/types/error-response";

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSkill(id),
    onSuccess: () => {
      toast.success("Навык успешно удалён");
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось удалить навык";
      toast.error(message);
    },
  });
};
