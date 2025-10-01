import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Outlet, useLocation } from "react-router";
import { PageHeader } from "@/components/dashboard/page-header";
import { Separator } from "@radix-ui/react-separator";
import { useEffect, useState } from "react";
import { useFilterPanelStore } from "@/stores/filter-panel-store";
import type { TabKey } from "@/types/tabs";

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
  const [active, setActive] = useState(location.pathname);
  const { setActiveTab } = useFilterPanelStore();

  useEffect(() => {
    setActive(location.pathname);

    const tab = pathToTabMap[location.pathname];
    const currentTab = useFilterPanelStore.getState().activeTab;

    if (location.pathname === "/storage") {
      const currentTab = useFilterPanelStore.getState().activeTab;

      // ✅ Только если tab вообще ещё не задан
      if (!storageTabs.includes(currentTab)) {
        setActiveTab("tool");
      }

      return;
    }

    if (tab && tab !== currentTab) {
      setActiveTab(tab);
    }
  }, [location.pathname, setActiveTab]);

  const handleClick = () => {
    setActive(location.pathname);

    const tab = pathToTabMap[location.pathname];
    if (location.pathname === "/storage") return;

    if (tab) {
      setActiveTab(tab);
    }
  };

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
