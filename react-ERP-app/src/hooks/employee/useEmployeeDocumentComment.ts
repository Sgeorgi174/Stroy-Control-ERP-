// @/hooks/employee/useDocumentComment.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateDocumentComment,
  deleteDocumentComment,
} from "@/services/api/employee.api";
import type { AppAxiosError } from "@/types/error-response";
import toast from "react-hot-toast";

export const useDocumentComment = (employeeId: string) => {
  const queryClient = useQueryClient();

  // Мутация для обновления/добавления комментария
  const updateMutation = useMutation({
    mutationFn: ({
      documentId,
      comment,
    }: {
      documentId: string;
      comment: string;
    }) => updateDocumentComment(documentId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employee-documents", employeeId],
      });
      toast.success("Комментарий сохранен");
    },
    onError: (error: AppAxiosError) => {
      toast.error(
        error?.response?.data?.message || "Ошибка при сохранении комментария",
      );
    },
  });

  // Мутация для удаления комментария
  const deleteMutation = useMutation({
    mutationFn: (documentId: string) => deleteDocumentComment(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employee-documents", employeeId],
      });
      toast.success("Комментарий удален");
    },
    onError: (error: AppAxiosError) => {
      toast.error(
        error?.response?.data?.message || "Ошибка при удалении комментария",
      );
    },
  });

  return {
    updateComment: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteComment: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
