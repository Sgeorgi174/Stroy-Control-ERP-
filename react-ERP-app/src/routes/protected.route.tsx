import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "@/stores/auth/auth.store";
import { useAuth } from "@/hooks/auth/useAuth";

export const ProtectedRoute = () => {
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useAuth();

  if (isAuthenticated && location.pathname === "/login") {
    return <Navigate to="/" replace />;
  }

  if (!isAuthenticated && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
