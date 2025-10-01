// hooks/object/useDeleteObject.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { closeObject } from "@/services/api/object.api";
import toast from "react-hot-toast";

export const useCloseObject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (objectId: string) => closeObject(objectId),
    onSuccess: () => {
      toast.success("Объект успешно закрыт");
      queryClient.invalidateQueries({ queryKey: ["objects"] });
    },
    onError: (error) => {
      console.error("Ошибка при закрытии объекта:", error);
      toast.error("Не удалось закрыть объект");
    },
  });
};
