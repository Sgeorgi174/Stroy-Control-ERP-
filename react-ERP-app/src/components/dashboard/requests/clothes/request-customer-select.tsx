// CustomerSelectForRequest.tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type CustomerSelectProps = {
  selectedCustomer: string; // теперь хранится сразу значение
  onSelectChange: (customer: string) => void;
  className?: string;
  disabled?: boolean;
};

export function CustomerSelectForRequest({
  selectedCustomer,
  onSelectChange,
  className,
  disabled = false,
}: CustomerSelectProps) {
  const customers = ["ИП Савельев", "ИП Вахитова"]; // можно вынести в константу или из API

  return (
    <Select
      disabled={disabled}
      value={selectedCustomer}
      onValueChange={(value) => onSelectChange(value)} // value = название
    >
      <SelectTrigger className={cn("w-[200px]", className || "")}>
        <SelectValue placeholder="Выберите заказчика" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Заказчик</SelectLabel>
          {customers.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
