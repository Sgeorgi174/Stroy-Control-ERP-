import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restoreEmployee } from "@/services/api/employee.api";
import toast from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";

export const useRestoreEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => restoreEmployee(id),
    onSuccess: (id: string) => {
      queryClient.invalidateQueries({ queryKey: ["employee", id] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Сотрудник удачно восстановлен из архива");
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось восстановить сотрудника";
      toast.error(message);
    },
  });
};
