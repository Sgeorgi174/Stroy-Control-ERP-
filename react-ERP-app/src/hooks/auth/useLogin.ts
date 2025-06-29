import { login } from "@/services/api/auth.api";
import type { LoginDto } from "@/types/dto/auth.dto";
import type { AppAxiosError } from "@/types/error-response";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginDto) => login(data),
    onSuccess: () => {
      toast.success("Код отправлен");
    },
    onError: (error: AppAxiosError) => {
      const message = error?.response?.data?.message || "Не удалось войти";
      toast.error(message);
    },
  });
};
