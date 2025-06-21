import { Calendar01 } from "@/components/calendar-01";
import { NotificationCard } from "@/components/dashboard/my-object/notification/notification-card";
import { Card } from "@/components/ui/card";
import { Clock } from "@/components/ui/clock";

// const notifications = [{ id: "1", text: "" }];

export function MyObject() {
  return (
    <div className="flex gap-10 mt-6 justify-center">
      <NotificationCard />
      <div className="flex flex-col gap-5">
        <Card className="w-[270px] flex justify-center items-center">
          <Clock className="font-bold text-6xl" />
        </Card>
        <Card className="w-[270px]flex justify-center p-2 items-center">
          <Calendar01 />
        </Card>
      </div>
    </div>
  );
}
