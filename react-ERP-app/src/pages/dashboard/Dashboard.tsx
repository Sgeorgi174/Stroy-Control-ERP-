import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Outlet, useLocation } from "react-router";
import { PageHeader } from "@/components/dashboard/page-header";
import { Separator } from "@radix-ui/react-separator";
import { useEffect, useState } from "react";
import { useFilterPanelStore } from "@/stores/filter-panel-store";
import type { TabKey } from "@/types/tabs";

const pathToTabMap: Record<string, TabKey> = {
  "/storage": "tool",
  "/objects": "object",
  "/employees": "employee",
};

export function Dashboard() {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const { setActiveTab } = useFilterPanelStore();

  const handleClick = () => {
    setActive(location.pathname);
    const tab = pathToTabMap[location.pathname];
    if (tab) {
      setActiveTab(tab);
    }
  };

  useEffect(() => {
    setActive(location.pathname);
    const tab = pathToTabMap[location.pathname];
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.pathname, setActiveTab]);

  return (
    <SidebarProvider>
      <AppSidebar active={active} handleClick={handleClick} />
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
