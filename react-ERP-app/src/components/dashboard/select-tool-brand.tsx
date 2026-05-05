import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToolBrands } from "@/hooks/tool/useToolBrand";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type BrandSelectProps = {
  selectedBrandId: string | undefined;
  onSelectChange: (brandId: string) => void;
  className?: string;
  disabled?: boolean;
};

export function BrandSelectForForms({
  selectedBrandId,
  onSelectChange,
  className,
  disabled = false,
}: BrandSelectProps) {
  const { data: brands = [], isLoading } = useToolBrands();

  return (
    <Select
      disabled={disabled || isLoading}
      value={selectedBrandId}
      onValueChange={onSelectChange}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue
          placeholder={isLoading ? "Загрузка..." : "Выберите бренд"}
        />
        {isLoading && (
          <Loader2 className="ml-2 h-4 w-4 animate-spin opacity-50" />
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Марка инструмента</SelectLabel>
          {brands.length === 0 && !isLoading ? (
            <div className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none text-muted-foreground">
              Бренды не найдены
            </div>
          ) : (
            brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.name}
              </SelectItem>
            ))
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
