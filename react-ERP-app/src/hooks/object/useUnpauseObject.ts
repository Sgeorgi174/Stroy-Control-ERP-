import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unpauseObject } from "@/services/api/object.api";
import toast from "react-hot-toast";

export const useUnpauseObject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (objectId: string) => unpauseObject(objectId),
    onSuccess: () => {
      toast.success("Возобновление работы объекта прошло успешно");
      queryClient.invalidateQueries({ queryKey: ["objects"] });
    },
    onError: (error) => {
      console.error("Ошибка при возобновлении работы объекта:", error);
      toast.error("Не удалось возобновить работу объекта");
    },
  });
};
