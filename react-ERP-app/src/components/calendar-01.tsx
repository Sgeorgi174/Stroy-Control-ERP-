import { Calendar } from "@/components/ui/calendar";
import { ru } from "date-fns/locale";
import { format } from "date-fns";

export function Calendar01() {
  const today = new Date();

  return (
    <Calendar
      mode="single"
      selected={today}
      defaultMonth={today}
      locale={ru}
      weekStartsOn={1}
      showOutsideDays
      className="bg-transparent w-full font-medium"
      buttonVariant="outline"
      formatters={{
        formatCaption: (month) => {
          const capitalized =
            format(month, "LLLL yyyy", { locale: ru }).charAt(0).toUpperCase() +
            format(month, "LLLL yyyy", { locale: ru }).slice(1);
          return capitalized;
        },
      }}
    />
  );
}
