import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unassignFromObject } from "@/services/api/employee.api";
import toast from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";

export const useUnassignEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => unassignFromObject(id),
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee", id] });
      toast.success("Сотрудник успешно снят с объекта");
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось снять сотрудника";
      toast.error(message);
    },
  });
};
