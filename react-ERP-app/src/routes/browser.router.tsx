import { createBrowserRouter } from "react-router";
import { ProtectedRoute } from "@/routes/protected.route";
import { Dashboard } from "@/pages/dashboard/Dashboard";
import { Storage } from "@/pages/storage/Storage";
import { Employees } from "@/pages/employees/Employees";
import { Objects } from "@/pages/objects/Objects";
import Auth from "@/pages/auth/Auth";

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
        children: [
          { path: "/storage", element: <Storage /> },
          { path: "/employees", element: <Employees /> },
          { path: "/objects", element: <Objects /> },
        ],
      },
      { path: "/login", element: <Auth /> },
    ],
  },
]);
