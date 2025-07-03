import {
  Building,
  ChartBarBig,
  HardHat,
  Store,
  Truck,
  Users,
} from "lucide-react";

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

const items = [
  {
    title: "Мой объект",
    url: "/",
    tab: "my-object",
    icon: HardHat,
  },
  {
    title: "Склад",
    url: "/storage",
    tab: "tool",
    icon: Store,
  },
  {
    title: "Перемещения",
    url: "/transfers",
    tab: "transfers",
    icon: Truck,
  },
  {
    title: "Объекты",
    url: "/objects",
    tab: "object",
    icon: Building,
  },
  {
    title: "Сотрудники",
    url: "/employees",
    tab: "employee",
    icon: Users,
  },
];

type AppSidebarProps = {
  active: string;
  handleClick: () => void;
};
export function AppSidebar({ active, handleClick }: AppSidebarProps) {
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
                    onClick={handleClick}
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
