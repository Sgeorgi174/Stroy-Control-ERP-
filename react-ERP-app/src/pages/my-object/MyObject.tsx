import { Calendar01 } from "@/components/calendar-01";
import { NotificationCard } from "@/components/dashboard/my-object/notification/notification-card";
import { Card } from "@/components/ui/card";
import { Clock } from "@/components/ui/clock";

export function MyObject() {
  return (
    <div className="grid grid-cols-5 gap-3 mt-6">
      <NotificationCard />
      <div className="col-span-2 flex flex-col gap-5">
        <Card className="flex justify-center p-2 items-center">
          <Clock className="font-medium p-2 text-5xl" />
        </Card>
        <Card className="p-5 shadow-md border rounded-2xl flex justify-center items-center">
          <div className="w-full max-w-[360px]">
            <Calendar01 />
          </div>
        </Card>
      </div>
    </div>
  );
}
