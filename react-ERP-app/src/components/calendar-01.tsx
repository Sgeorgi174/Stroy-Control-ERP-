import { Calendar } from "@/components/ui/calendar";
import { ru } from "date-fns/locale";

export function Calendar01() {
  const today = new Date();

  return (
    <Calendar
      mode="single"
      selected={today}
      defaultMonth={today}
      locale={ru}
      weekStartsOn={1}
      showOutsideDays={false}
      className="w-full bg-transparent pointer-events-none"
      hideNavigation
    />
  );
}
