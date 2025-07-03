import { checkAuth } from "@/services/api/auth.api";
import { useAuthStore } from "@/stores/auth/auth.store";
import type { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useAuth = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  const query = useQuery<User, Error>({
    queryKey: ["auth", "me"],
    queryFn: checkAuth,
    retry: false,
  });

  // ⚠️ сайд-эффекты через useEffect
  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  useEffect(() => {
    if (query.isError) {
      clearUser();
    }
  }, [query.isError, clearUser]);

  return query;
};
