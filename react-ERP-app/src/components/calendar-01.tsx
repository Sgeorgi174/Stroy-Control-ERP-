import { Calendar } from "@/components/ui/calendar";
import { ru } from "date-fns/locale";
import { format, isSameDay } from "date-fns";

interface Calendar01Props {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  shiftDates?: Date[]; // даты с открытыми сменами
}

export function Calendar01({
  selectedDate,
  onSelectDate,
  shiftDates = [],
}: Calendar01Props) {
  const modifiers = {
    shiftDay: (date: Date) =>
      shiftDates.some((shiftDate) => isSameDay(shiftDate, date)),
  };

  return (
    <Calendar
      mode="single"
      required
      selected={selectedDate}
      onSelect={onSelectDate}
      defaultMonth={selectedDate}
      locale={ru}
      weekStartsOn={1}
      showOutsideDays
      buttonVariant="outline"
      className="bg-transparent w-full font-medium"
      formatters={{
        formatCaption: (month) => {
          const capitalized =
            format(month, "LLLL yyyy", { locale: ru }).charAt(0).toUpperCase() +
            format(month, "LLLL yyyy", { locale: ru }).slice(1);
          return capitalized;
        },
      }}
      modifiers={modifiers}
      modifiersClassNames={{
        shiftDay:
          "relative after:absolute after:top-2 after:right-2 after:w-2 after:h-2 after:rounded-full after:bg-blue-500",
      }}
    />
  );
}
