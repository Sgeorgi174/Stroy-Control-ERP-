import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeEmployeeDebt } from "@/services/api/employee.api";
import type { ChangeDebtDto } from "@/types/dto/employee.dto";
import toast from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";

export const useChangeEmployeeDebt = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChangeDebtDto) => changeEmployeeDebt(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-clothing"] });
      toast.success("Данные о задолжности сотрудника обновлены");
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось обновить долг сотрудника";
      toast.error(message);
    },
  });
};
