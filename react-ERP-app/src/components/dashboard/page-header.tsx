import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

type PageHeaderProps = {
  location: string;
};

export function PageHeader({ location }: PageHeaderProps) {
  return (
    <header className="w-full">
      <div className="flex  items-center gap-1">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">
          {location === "/storage"
            ? "Склад"
            : location === "/employees"
            ? "Сотрудники"
            : "Объекты"}
        </h1>
        <div className="ml-auto flex items-center gap-2"></div>
      </div>
    </header>
  );
}
