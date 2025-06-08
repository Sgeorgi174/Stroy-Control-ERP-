import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Outlet, useLocation } from "react-router";
import { PageHeader } from "@/components/dashboard/page-header";
import { Separator } from "@radix-ui/react-separator";
import { useEffect, useState } from "react";

export function Dashboard() {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);

  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  return (
    <SidebarProvider>
      <AppSidebar
        active={active}
        onClick={() => setActive(location.pathname)}
      />
      <SidebarInset className="p-3">
        <PageHeader location={location.pathname} />
        <Separator
          orientation="horizontal"
          className="mt-2 w-full h-px bg-border"
        />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
