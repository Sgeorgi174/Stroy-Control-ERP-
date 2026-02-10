import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Archive } from "lucide-react";

export function EmployeeHintForDoc() {
  return (
    <Popover>
      <PopoverTrigger className="ml-5" asChild>
        <Button variant="outline">
          <Archive />
          Заметка для документов
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-120">
        <p>
          <span className="font-medium">Общие требования ОТ</span> - 1 раз в три
          года
        </p>
        <p>
          <span className="font-medium">Вредные факторы ОТ</span> - 1 раз в три
          года
        </p>
        <p>
          <span className="font-medium">Повышенные опастности ОТ</span> -
          Ежегодно
        </p>
        <p>
          <span className="font-medium">Первая помощь</span> - 1 раз в три года
        </p>
        <p>
          <span className="font-medium">Высота 1 и 2 группа</span> - 1 раз в три
          года
        </p>
        <p>
          <span className="font-medium">Высота 3 группа</span> - 1 раз в пять
          лет
        </p>
        <p>
          <span className="font-medium">Стропальщик</span> - 1 раз в год
        </p>
        <p>
          <span className="font-medium">Рабочий люльки</span> - 1 раз в год
        </p>
        <p>
          <span className="font-medium">Машинист подъемника</span> - 1 раз в год
        </p>
        <p>
          <span className="font-medium">Сварщик</span> - Бессрочно
        </p>
      </PopoverContent>
    </Popover>
  );
}
