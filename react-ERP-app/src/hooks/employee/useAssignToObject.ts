import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AssignEmployeesDto } from "@/types/dto/employee.dto";
import { assignToObject } from "@/services/api/employee.api";

export const useAssignToObject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignEmployeesDto) => assignToObject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["objects"] });
      toast.success(`Сотрудники успешно добавлены на объект`);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Не удалось добавить сотрудников";
      toast.error(message);
    },
  });
};
