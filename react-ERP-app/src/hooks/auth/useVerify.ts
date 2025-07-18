import { verifyOtp } from "@/services/api/auth.api";
import { useAuthStore } from "@/stores/auth/auth.store";
import type { VerifyDto } from "@/types/dto/auth.dto";
import type { AppAxiosError } from "@/types/error-response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useVerifyOtp = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VerifyDto) => verifyOtp(data),
    onSuccess: (user) => {
      setUser(user);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success("Вы вошли в систему");
    },
    onError: (error: AppAxiosError) => {
      const message = error?.response?.data?.message || "Ошибка";
      toast.error(message);
    },
  });
};
