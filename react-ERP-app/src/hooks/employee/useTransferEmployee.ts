import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transferEmployee } from "@/services/api/employee.api";
import type { TransferEmployeeDto } from "@/types/dto/employee.dto";
import toast from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";

export const useTransferEmployee = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TransferEmployeeDto) => transferEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee", id] });
      toast.success("Сотрудник успешно переведен");
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось перевести сотрудника";
      toast.error(message);
    },
  });
};
