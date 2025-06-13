import { useEffect, useState } from "react";
import { format } from "date-fns";

type ClockProps = {
  className?: string;
};

export function Clock({ className }: ClockProps) {
  const [time, setTime] = useState(() => format(new Date(), "HH:mm"));

  useEffect(() => {
    const updateTime = () => setTime(format(new Date(), "HH:mm"));

    updateTime();
    const interval = setInterval(updateTime, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return <p className={className}>{time}</p>;
}
