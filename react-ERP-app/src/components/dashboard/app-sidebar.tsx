import { Building, ChartBarBig, Store, Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router";

// Menu items.
const items = [
  {
    title: "Склад",
    url: "/storage",
    icon: Store,
  },
  {
    title: "Сотрудники",
    url: "/employees",
    icon: Users,
  },
  {
    title: "Объекты",
    url: "/objects",
    icon: Building,
  },
];

type AppSidebarProps = {
  active: string;
  onClick: () => void;
};
export function AppSidebar({ active, onClick }: AppSidebarProps) {
  return (
    <Sidebar variant="inset">
      <SidebarContent>
        <SidebarHeader>
          <div className="flex w-full justify-start items-center gap-3">
            <ChartBarBig size={30} />
            <p className="font-bold text-xl">Строй Контроль</p>
          </div>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    size="lg"
                    onClick={onClick}
                    isActive={item.url === active}
                    asChild
                  >
                    <Link to={item.url} className="flex items-center gap-4">
                      <item.icon />
                      <span className="text-xl">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
