import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pauseObject } from "@/services/api/object.api";
import toast from "react-hot-toast";

export const usePauseObject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (objectId: string) => pauseObject(objectId),
    onSuccess: () => {
      toast.success("Объект успешно приостановлен");
      queryClient.invalidateQueries({ queryKey: ["objects"] });
    },
    onError: (error) => {
      console.error("Ошибка при поставки объекта на паузу:", error);
      toast.error("Не удалось приостановить объект");
    },
  });
};
