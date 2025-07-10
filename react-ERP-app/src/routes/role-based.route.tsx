// src/routes/role-based-route.tsx
import { useAuthStore } from "@/stores/auth/auth.store";
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
  const user = useAuthStore((s) => s.user);

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <Navigate to={redirectTo ?? getDefaultRedirect(user?.role)} replace />
    );
  }

  return <Outlet />;
};
