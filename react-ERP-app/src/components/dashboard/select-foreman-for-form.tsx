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
import type { User } from "@/types/user";

type ForemanAutocompleteProps = {
  foremen: User[];
  selectedUserId: string | null;
  onSelectChange: (id: string) => void;
  disabled?: boolean;
};

export function ForemanAutocomplete({
  foremen = [],
  selectedUserId,
  onSelectChange,
  disabled,
}: ForemanAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");

  useEffect(() => {
    const selected = foremen.find((e) => e.id === selectedUserId);
    if (selected) {
      setSelectedLabel(`${selected.lastName} ${selected.firstName}`);
    } else {
      setSelectedLabel("");
    }
  }, [selectedUserId, foremen]);

  const handleSelect = (userId: string) => {
    const user = foremen.find((u) => u.id === userId);
    if (user) {
      onSelectChange(userId);
      setSelectedLabel(`${user.lastName} ${user.firstName}`);
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
          {selectedLabel || "Выберите бригадира"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0 max-h-60 overflow-auto">
        <Command>
          <CommandInput placeholder="Поиск..." />
          <CommandEmpty>Совпадений не найдено</CommandEmpty>
          <CommandGroup>
            {foremen.map((user) => {
              const fullName = `${user.lastName} ${user.firstName}`;
              return (
                <CommandItem
                  key={user.id}
                  value={fullName}
                  onSelect={() => handleSelect(user.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedUserId === user.id ? "opacity-100" : "opacity-0"
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
