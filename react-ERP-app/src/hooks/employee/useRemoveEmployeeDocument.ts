import { removeEmployeeDocument } from "@/services/api/employee.api";
import type { AppAxiosError } from "@/types/error-response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useRemoveEmployeeDocument = (employeeId: string) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: removeEmployeeDocument,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["employee-documents", employeeId],
      });
      toast.success("Документ удалён");
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось удалить документ";
      toast.error(message);
    },
  });
};
