// src/routes/role-based-route.tsx
import { useAuth } from "@/hooks/auth/useAuth";
import type { Role } from "@/types/user";
import { Navigate, Outlet } from "react-router";

type RoleBasedRouteProps = {
  allowedRoles: Role[];
  redirectTo?: string;
};

const getDefaultRedirect = (role?: Role): string => {
  switch (role) {
    case "FOREMAN":
      return "/my-object";
    case "OWNER":
    case "ACCOUNTANT":
    case "MASTER":
      return "/monitoring";
    default:
      return "/storage";
  }
};

export const RoleBasedRoute = ({
  allowedRoles,
  redirectTo,
}: RoleBasedRouteProps) => {
  const { data: user, isLoading } = useAuth();

  if (isLoading) {
    // Пока идёт загрузка пользователя, можно показать пустоту или спиннер
    return null;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <Navigate to={redirectTo ?? getDefaultRedirect(user?.role)} replace />
    );
  }

  return <Outlet />;
};
