import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProviders } from "@/hooks/clothes/useClothes";
import { cn } from "@/lib/utils";

type ProviderSelectProps = {
  selectedProvider: string;
  onSelectChange: (provider: string) => void;
  className?: string;
  disabled?: boolean;
};

export function ProviderSelectForForms({
  selectedProvider,
  onSelectChange,
  className,
  disabled = false,
}: ProviderSelectProps) {
  const { data: providers = [] } = useProviders();

  return (
    <Select
      disabled={disabled}
      value={selectedProvider}
      onValueChange={(value) => onSelectChange(value)}
    >
      <SelectTrigger className={cn("w-[200px]", className ? className : "")}>
        <SelectValue placeholder="Поставщик" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Поставщик</SelectLabel>
          {providers.map((provider) => (
            <SelectItem key={provider.id} value={provider.id}>
              {provider.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
