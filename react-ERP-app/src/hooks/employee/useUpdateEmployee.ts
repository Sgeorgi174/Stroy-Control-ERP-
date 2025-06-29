import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEmployee } from "@/services/api/employee.api";
import type { UpdateEmployeeDto } from "@/types/dto/employee.dto";
import toast from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";

export const useUpdateEmployee = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateEmployeeDto) => updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee", id] });
      toast.success("Данные сотрудника обновлены");
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось обновить сотрудника";
      toast.error(message);
    },
  });
};
