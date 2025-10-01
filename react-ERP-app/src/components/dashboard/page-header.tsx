import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";

type PageHeaderProps = {
  location: string;
};

const pathToTabMap = {
  "/monitoring": "Сводка по объектам",
  "/my-object": "Мой объект",
  "/storage": "Склад",
  "/objects": "Объекты",
  "/employees": "Сотрудники",
  "/transfers": "Перемещения",
  "/admin": "Админка",
};

export function PageHeader({ location }: PageHeaderProps) {
  return (
    <header className="w-full flex items-center justify-between">
      <div className="flex  items-center gap-1">
        <SidebarTrigger
          size={"icon"}
          className="-ml-1 [&_svg:not([class*='size-'])]:size-5"
        />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-xl font-medium">
          {pathToTabMap[location as keyof typeof pathToTabMap] ??
            "Неизвестный раздел"}
        </h1>
        <div className="ml-auto flex items-center gap-2"></div>
      </div>

      <ModeToggle />
    </header>
  );
}
