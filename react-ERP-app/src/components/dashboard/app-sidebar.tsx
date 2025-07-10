import {
  Blocks,
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
import { useAuthStore } from "@/stores/auth/auth.store";

const sidebarItems = [
  {
    title: "Сводка по объектам",
    url: "/monitoring",
    tab: "monitoring",
    icon: Blocks,
    roles: ["OWNER", "ACCOUNTANT", "FOREMAN", "MASTER"],
  },
  {
    title: "Мой объект",
    url: "/my-object",
    tab: "my-object",
    icon: HardHat,
    roles: ["OWNER", "ACCOUNTANT", "FOREMAN", "MASTER"],
  },
  {
    title: "Склад",
    url: "/storage",
    tab: "tool",
    icon: Store,
    roles: ["OWNER", "ACCOUNTANT", "FOREMAN", "MASTER"],
  },
  {
    title: "Перемещения",
    url: "/transfers",
    tab: "transfers",
    icon: Truck,
    roles: ["OWNER", "ACCOUNTANT", "FOREMAN", "MASTER"],
  },
  {
    title: "Объекты",
    url: "/objects",
    tab: "object",
    icon: Building,
    roles: ["OWNER", "ACCOUNTANT", "FOREMAN", "MASTER"],
  },
  {
    title: "Сотрудники",
    url: "/employees",
    tab: "employee",
    icon: Users,
    roles: ["OWNER", "ACCOUNTANT", "FOREMAN", "MASTER"],
  },
];

type AppSidebarProps = {
  active: string;
  handleClick: () => void;
};
export function AppSidebar({ active, handleClick }: AppSidebarProps) {
  const user = useAuthStore((s) => s.user);

  console.log(user);

  if (!user) return null;

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
              {sidebarItems
                .filter((item) => item.roles.includes(user.role))
                .map((item) => (
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
