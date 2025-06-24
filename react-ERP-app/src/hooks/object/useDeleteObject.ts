// hooks/object/useDeleteObject.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteObject } from "@/services/api/object.api";
import toast from "react-hot-toast";

export const useDeleteObject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (objectId: string) => deleteObject(objectId),
    onSuccess: () => {
      toast.success("Объект успешно удалён");
      queryClient.invalidateQueries({ queryKey: ["objects"] });
    },
    onError: (error) => {
      console.error("Ошибка при удалении планшета:", error);
      toast.error("Не удалось удалить объект");
    },
  });
};
