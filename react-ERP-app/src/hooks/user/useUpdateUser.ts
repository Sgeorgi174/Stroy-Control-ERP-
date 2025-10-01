import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";
import type { UpdateUserDto } from "@/types/dto/user.dto";
import { updateUser } from "@/services/api/user.api";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { userId: string } & UpdateUserDto) =>
      updateUser(data.userId, data),
    onSuccess: (data) => {
      toast.success(`Юзер «${data.name}» успешно обновлён`);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", data.userId] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось обновить юзера";
      toast.error(message);
    },
  });
};
