import { useAuthStore } from "@/stores/auth/auth.store";
import { Navigate } from "react-router";

export function RoleRedirect() {
  const user = useAuthStore((s) => s.user);

  switch (user?.role) {
    case "FOREMAN":
      return <Navigate to="/my-object" replace />;
    case "OWNER":
    case "ACCOUNTANT":
    case "MASTER":
      return <Navigate to="/monitoring" replace />;
    default:
      return <Navigate to="/storage" replace />;
  }
}
