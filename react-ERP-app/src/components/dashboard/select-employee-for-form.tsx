import { useEffect, useState } from "react";
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

type ForemanAutocompleteProps = {
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
}: ForemanAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");

  useEffect(() => {
    const selected = employees.find((e) => e.id === selectedEmployeeId);

    if (selected) {
      setSelectedLabel(`${selected.lastName} ${selected.firstName}`);
    } else {
      setSelectedLabel("");
    }
  }, [selectedEmployeeId, employees]);

  const handleSelect = (employeeId: string) => {
    const employee = employees.find((u) => u.id === employeeId);
    if (employee) {
      onSelectChange(employeeId);
      setSelectedLabel(`${employee.lastName} ${employee.firstName}`);
      setOpen(false);
    }
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
      <PopoverContent className="w-[250px] p-0 max-h-60 overflow-auto">
        <Command>
          <CommandInput placeholder="Поиск..." />
          <CommandEmpty>Совпадений не найдено</CommandEmpty>
          <CommandGroup>
            {employees.map((employee) => {
              const fullName = `${employee.lastName} ${employee.firstName}`;
              return (
                <CommandItem
                  key={employee.id}
                  value={fullName} // используем имя для поиска
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
