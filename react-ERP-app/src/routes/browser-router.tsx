import { createBrowserRouter } from "react-router";
import { ProtectedRoute } from "./protected-route";
import Auth from "../modules/auth/Auth";
import { Dashboard } from "../modules/dashboard/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      { path: "/", element: <Dashboard /> },
      // Другие защищённые роуты...
    ],
  },
  { path: "/login", element: <Auth /> },
]);
