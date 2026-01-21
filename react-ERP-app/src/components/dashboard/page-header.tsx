import { useNavigate, useParams } from "react-router";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Archive, ArrowLeft } from "lucide-react";
import { useObjectHeaderStore } from "@/stores/object-header-store";
import { useAuth } from "@/hooks/auth/useAuth";
import { DatePickerForShift } from "./filter-panel/date-picker-for-shift";

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
  "/reports": "Отчеты",
};

export function PageHeader({ location }: PageHeaderProps) {
  const { id } = useParams<{ id: string }>();
  const objectName = useObjectHeaderStore((s) => s.objectName);
  const { data: user } = useAuth();
  const navigate = useNavigate();

  const showBackButton =
    location !== "/my-object" &&
    ((user?.primaryObjects?.length ?? 0) > 1 ||
      user?.role === "ADMIN" ||
      user?.role === "ACCOUNTANT");

  // Если на странице /my-object/:id и есть имя объекта → показываем его
  const title =
    location.startsWith("/my-object") && id && objectName
      ? objectName
      : pathToTabMap[location as keyof typeof pathToTabMap] ??
        "Неизвестный раздел";

  return (
    <header className="w-full flex items-center justify-between">
      <div className="flex items-center gap-1">
        <SidebarTrigger
          size={"icon"}
          className="-ml-1 [&_svg:not([class*='size-'])]:size-5"
        />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex items-center gap-6">
          {showBackButton && id && (
            <Button
              variant={"outline"}
              onClick={() => navigate("/my-object")}
              className="flex items-center gap-2 font-medium"
            >
              <ArrowLeft size={18} />
              Вернуться к выбору объекта
            </Button>
          )}
          <h1 className="text-xl font-medium">{title}</h1>
        </div>

        <div className="ml-auto flex items-center gap-2"></div>
        {location === "/storage" && (
          <Popover>
            <PopoverTrigger className="ml-5" asChild>
              <Button variant="outline">
                <Archive />
                Заметка для серийных номеров
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <p>
                <span className="font-medium">ПР</span> - Пресс
              </p>
              <p>
                <span className="font-medium">ЭИ</span> - Электроинструмент
              </p>
              <p>
                <span className="font-medium">ИН</span> - Прочий инвентарь
              </p>
              <p>
                <span className="font-medium">ОР</span> - Бытовая и орг. техника
              </p>
            </PopoverContent>
          </Popover>
        )}
      </div>

      <div className="flex gap-5">
        {location === "/monitoring" && <DatePickerForShift />}
        <ModeToggle />
      </div>
    </header>
  );
}
