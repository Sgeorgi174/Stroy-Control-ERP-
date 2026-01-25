import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadEmployeeDocument } from "@/services/api/employee.api";
import toast from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";
import type { UploadEmployeeDocumentDto } from "@/types/dto/employee.dto";

export const useUploadEmployeeDocument = (employeeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      data,
    }: {
      file: File;
      data: UploadEmployeeDocumentDto;
    }) => uploadEmployeeDocument(employeeId, file, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employee-documents", employeeId],
      });
      toast.success("Документ успешно загружен");
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось загрузить документ";
      toast.error(message);
    },
  });
};
