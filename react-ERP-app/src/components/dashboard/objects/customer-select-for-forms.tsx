import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCustomers } from "@/hooks/object/useCustomers";
import { cn } from "@/lib/utils";

type CustomerSelectForFormsProps = {
  selectedCustomer: string;
  onSelectChange: (customer: string) => void;
  className?: string;
  disabled?: boolean;
};

export function CustomerSelectForForms({
  selectedCustomer,
  onSelectChange,
  className,
  disabled = false,
}: CustomerSelectForFormsProps) {
  const { data: customers = [] } = useCustomers();

  return (
    <Select
      disabled={disabled}
      value={selectedCustomer}
      onValueChange={(value) => onSelectChange(value)}
    >
      <SelectTrigger className={cn("w-[200px]", className ? className : "")}>
        <SelectValue placeholder="Заказчик" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Заказчик</SelectLabel>
          {customers.map((customer) => (
            <SelectItem key={customer.id} value={customer.id}>
              {`${customer.name} ${
                customer.shortName ? `(${customer.shortName})` : ""
              }`}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
