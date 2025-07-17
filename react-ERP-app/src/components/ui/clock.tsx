import { useEffect, useState } from "react";
import { format } from "date-fns";

type ClockProps = {
  className?: string;
};

export function Clock({ className }: ClockProps) {
  const [time, setTime] = useState(() => format(new Date(), "HH:mm"));

  useEffect(() => {
    const updateTime = () => setTime(format(new Date(), "HH:mm"));

    updateTime(); // первая установка сразу

    const now = new Date();
    const msToNextMinute =
      (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

    const timeout = setTimeout(() => {
      updateTime();
      const interval = setInterval(updateTime, 60 * 1000);
      return () => clearInterval(interval);
    }, msToNextMinute);

    return () => clearTimeout(timeout);
  }, []);

  const [hours, minutes] = time.split(":");

  return (
    <p
      className={`font-medium flex items-center justify-center gap-1 leading-none ${className}`}
    >
      <span>{hours}</span>
      <span className="relative top-[-4px]">:</span>
      <span>{minutes}</span>
    </p>
  );
}
