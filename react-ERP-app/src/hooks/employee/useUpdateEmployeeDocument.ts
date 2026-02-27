import { updateEmployeeDocument } from "@/services/api/employee.api";
import type { UpdateEmployeeDocumentDto } from "@/types/dto/employee.dto";
import type { AppAxiosError } from "@/types/error-response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateEmployeeDocument = (employeeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentId,
      data,
    }: {
      documentId: string;
      data: UpdateEmployeeDocumentDto;
    }) => updateEmployeeDocument(documentId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employee-documents", employeeId],
      });
      // Также полезно обновить данные самого сотрудника, если документы лежат внутри него
      queryClient.invalidateQueries({
        queryKey: ["employee", employeeId],
      });
      toast.success("Документ обновлен");
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось обновить документ";
      toast.error(message);
    },
  });
};
