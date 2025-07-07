import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFilterPanelStore } from "@/stores/filter-panel-store";
import { Label } from "@/components/ui/label";

export function DatePicker() {
  const [open, setOpen] = React.useState(false);
  const date = useFilterPanelStore((s) => s.selectedTransferDate);
  const setDate = useFilterPanelStore((s) => s.setSelectedTransferDate);

  return (
    <div className="flex gap-2">
      <Label>Дата:</Label>
      <div className="flex flex-col gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-48 justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Выберите дату"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                if (date) {
                  setDate(date);
                  setOpen(false);
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
