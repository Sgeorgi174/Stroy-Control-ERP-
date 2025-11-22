import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet, useLocation } from "react-router";
import { PageHeader } from "@/components/dashboard/page-header";
import { Separator } from "@radix-ui/react-separator";
import { useEffect } from "react";
import { useFilterPanelStore } from "@/stores/filter-panel-store";
import type { TabKey } from "@/types/tabs";
import { AppSidebar } from "@/components/dashboard/app-sidebar";

const pathToTabMap: Record<string, TabKey> = {
  "/monitoring": "monitoring",
  "/my-object": "my-object",
  "/objects": "object",
  "/employees": "employee",
  "/transfers": "transfers",
  "/admin": "admin",
};

const storageTabs: TabKey[] = [
  "tool",
  "device",
  "tablet",
  "footwear",
  "clothing",
];

export function Dashboard() {
  const location = useLocation();
  const { setActiveTab } = useFilterPanelStore();

  useEffect(() => {
    if (location.pathname === "/storage") {
      if (!storageTabs.includes(useFilterPanelStore.getState().activeTab)) {
        setActiveTab("tool");
      }
    } else {
      const tab = pathToTabMap[location.pathname];
      if (tab) setActiveTab(tab);
    }
  }, [location.pathname, setActiveTab]);

  return (
    <SidebarProvider>
      <AppSidebar />
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
