import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProviderSelectProps = {
  prefix: string;
  setPrefix: (prefix: string) => void;
  className?: string;
  isTool: boolean;
};

export function SelectPreffixForInventory({
  setPrefix,
  className,
  isTool,
}: ProviderSelectProps) {
  return (
    <Select onValueChange={(value) => setPrefix(value)}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Выберите категорию" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem disabled={!isTool} value="ПР">
          ПР — Пресс
        </SelectItem>
        <SelectItem disabled={!isTool} value="ЭИ">
          ЭИ — Электроинструмент
        </SelectItem>
        <SelectItem disabled={!isTool} value="ИН">
          ИН — Прочий инвентарь
        </SelectItem>
        <SelectItem disabled={isTool} value="ОР">
          ОР - Бытовая и Орг. техника
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
