import { useAuth } from "@/hooks/auth/useAuth";
import { LoaderCircle } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router";

export const ProtectedRoute = () => {
  const location = useLocation();
  const { isLoading, data: user, isError } = useAuth();

  const isAuthenticated = !!user;
  const isLoginPage = location.pathname === "/login";

  // Пока идёт проверка сессии — спиннер
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle
          size={100}
          className="animate-spin text-muted-foreground"
        />
      </div>
    );
  }

  // ⛔️ Ошибка при проверке сессии — значит пользователь неавторизован
  if (isError && !isLoginPage) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Авторизован и на /login — редирект на /
  if (isAuthenticated && isLoginPage) {
    return <Navigate to="/" replace />;
  }

  // ❌ Не авторизован и не на /login — редирект на /login
  if (!isAuthenticated && !isLoginPage) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Все остальные случаи — пропускаем внутрь
  return <Outlet />;
};
