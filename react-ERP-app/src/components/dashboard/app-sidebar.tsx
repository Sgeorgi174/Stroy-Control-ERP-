import {
  Blocks,
  Building,
  ChartBarBig,
  HardHat,
  LogOut,
  MessageCircleQuestion,
  Shield,
  Store,
  Truck,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router";
import { useAuthStore } from "@/stores/auth/auth.store";
import { Button } from "../ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

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
  {
    title: "Админ-панель",
    url: "/admin",
    tab: "admin",
    icon: Shield,
    roles: ["OWNER", "ACCOUNTANT", "FOREMAN", "MASTER"],
  },
];

type AppSidebarProps = {
  active: string;
  handleClick: () => void;
};
export function AppSidebar({ active, handleClick }: AppSidebarProps) {
  const user = useAuthStore((s) => s.user);

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
      <SidebarFooter>
        <div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <MessageCircleQuestion />
                  <p>Помощь</p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p className="font-medium">
                  Если у вас возникли вопросы или трудности в работе приложения.
                </p>
                <div className="flex flex-col gap-1">
                  <p className="text-[15px] font-medium">🖥 Георгий Силантьев</p>
                  <p className="text-[15px] font-medium">
                    📞 Телефон: +7-902-893-47-98
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="border rounded-xl p-5 mt-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{`${user.lastName} ${user.firstName}`}</p>
              <p className="text-sm text-muted-foreground">{user.phone}</p>
            </div>
            <Button className="rounded-xl cursor-pointer">
              <LogOut />
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
