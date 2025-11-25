import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/hooks/auth/useAuth";
import { LoaderCircle } from "lucide-react";

export const ProtectedRoute = () => {
  const location = useLocation();
  const { isLoading, data: user } = useAuth();

  // Пока идет проверка сессии — спиннер
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

  // Не авторизован — редирект на login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && location.pathname === "/") {
    return <Navigate to="/storage" replace />;
  }

  // Авторизован — показываем приватные маршруты
  return <Outlet />;
};
