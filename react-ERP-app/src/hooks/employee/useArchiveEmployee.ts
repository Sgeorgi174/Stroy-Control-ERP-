import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveEmployee } from "@/services/api/employee.api";
import type { ArchiveDto } from "@/types/dto/employee.dto";
import toast from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";

export const useArchiveEmployee = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ArchiveDto) => archiveEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee", id] });
      toast.success("Сотрудник удачно перемещен в архив");
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось архивировать сотрудника";
      toast.error(message);
    },
  });
};
