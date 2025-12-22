import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCustomClothes } from "@/services/api/employee.api";
import toast from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";

export const useDeleteCustomClothes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCustomClothes(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-clothing"] });
      toast.success("Одежда удалена");
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось удалить одежду";
      toast.error(message);
    },
  });
};
