import { Navigate, Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loader";
import { useAuthStore } from "@/stores/auth/auth.store";

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, initAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    initAuth();
  }, []);

  if (isLoading) return <LoadingSpinner size={100} />; // Ваш компонент загрузки

  if (isAuthenticated && location.pathname === "/login") {
    return <Navigate to="/" replace />;
  }

  if (!isAuthenticated && location.pathname !== "/login") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};
