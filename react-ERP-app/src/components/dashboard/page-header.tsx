import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";

type PageHeaderProps = {
  location: string;
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
          {location === "/storage"
            ? "Склад"
            : location === "/employees"
            ? "Сотрудники"
            : "Объекты"}
        </h1>
        <div className="ml-auto flex items-center gap-2"></div>
      </div>
      <ModeToggle />
    </header>
  );
}
