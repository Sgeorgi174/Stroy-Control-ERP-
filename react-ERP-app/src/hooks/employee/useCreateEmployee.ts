import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEmployee } from "@/services/api/employee.api";
import type { CreateEmployeeDto } from "@/types/dto/employee.dto";
import toast from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmployeeDto) => createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Сотрудник успешно создан");
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось создать сотрудника";
      toast.error(message);
    },
  });
};
