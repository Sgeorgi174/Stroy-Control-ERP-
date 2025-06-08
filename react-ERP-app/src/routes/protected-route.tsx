import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../stores/auth.store";
import { useEffect } from "react";

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, initAuth } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated === false && isLoading === true) {
      initAuth();
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
