import { useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import type { Employee } from "@/types/employee";

type EmployeeAutocompleteProps = {
  employees: Employee[];
  selectedEmployeeId: string | null;
  onSelectChange: (id: string) => void;
  disabled?: boolean;
};

export function EmployeeAutocomplete({
  employees,
  selectedEmployeeId,
  onSelectChange,
  disabled,
}: EmployeeAutocompleteProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    const selected = employees.find((e) => e.id === selectedEmployeeId);
    return selected
      ? `${selected.lastName} ${selected.firstName} ${
          selected.fatherName ?? ""
        }`.trim()
      : "";
  }, [selectedEmployeeId, employees]);

  const handleSelect = (employeeId: string) => {
    onSelectChange(employeeId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-[300px]"
          disabled={disabled}
        >
          {selectedLabel || "Выберите сотрудника"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 max-h-60 overflow-auto">
        <Command>
          <CommandInput placeholder="Поиск..." />
          <CommandEmpty>Совпадений не найдено</CommandEmpty>
          <CommandGroup>
            {employees.map((employee) => {
              const fullName = `${employee.lastName} ${employee.firstName} ${
                employee.fatherName ?? ""
              }`.trim();

              return (
                <CommandItem
                  key={employee.id}
                  value={fullName.toLowerCase()} // используем полное имя для фильтрации
                  onSelect={() => handleSelect(employee.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedEmployeeId === employee.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {fullName}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
