import { logout } from "@/services/api/auth.api";
import { useAuthStore } from "@/stores/auth/auth.store";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useLogout = () => {
  const clearUser = useAuthStore((s) => s.clearUser);

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearUser();
      toast.success("Вы вышли из системы");
    },
    onError: () => {
      toast.error("Ошибка при выходе");
    },
  });
};
