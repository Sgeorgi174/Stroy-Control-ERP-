// src/routes/index.tsx
import { createBrowserRouter } from "react-router";
import { ProtectedRoute } from "@/routes/protected.route";
import { Dashboard } from "@/pages/dashboard/Dashboard";
import { Storage } from "@/pages/storage/Storage";
import { Employees } from "@/pages/employees/Employees";
import { Objects } from "@/pages/objects/Objects";
import { Auth } from "@/pages/auth/Auth";
import { MyObject } from "@/pages/my-object/MyObject";
import { NotFound } from "@/pages/not-found/NotFound";
import { Transfers } from "@/pages/transfers/Transfers";
import { Monitoring } from "@/pages/monitoring/Monitoring";
import { AdminPanelPage } from "@/pages/admin-panel/Admin-panel";

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
        children: [
          { path: "/monitoring", element: <Monitoring /> },
          { path: "/employees", element: <Employees /> },
          { path: "/objects", element: <Objects /> },
          { path: "/transfers", element: <Transfers /> },
          { path: "/storage", element: <Storage /> },
          { path: "/admin", element: <AdminPanelPage /> },
          { path: "/my-object", element: <MyObject /> },
        ],
      },

      // 🔑 Авторизация и ошибки
      { path: "/login", element: <Auth /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
