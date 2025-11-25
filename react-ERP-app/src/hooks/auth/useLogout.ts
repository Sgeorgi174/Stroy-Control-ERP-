import { logout } from "@/services/api/auth.api";
import { useAuthStore } from "@/stores/auth/auth.store";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export const useLogout = () => {
  const clearUser = useAuthStore((s) => s.clearUser);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearUser();
      toast.success("Вы вышли из системы");
      navigate("/login"); // редирект на страницу логина
    },
    onError: () => {
      toast.error("Ошибка при выходе");
    },
  });
};
