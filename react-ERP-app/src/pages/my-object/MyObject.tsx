import Calendar01 from "@/components/calendar-01";
import { Card } from "@/components/ui/card";
import { Clock } from "@/components/ui/clock";

// const notifications = [{ id: "1", text: "" }];

export function MyObject() {
  return (
    <div className="flex gap-10 mt-6 justify-center">
      <Card className="w-[600px] min-[1401px]:w-[800px]">
        <p className="font-bold text-center">Уведомления</p>
        <div className="w-full h-full flex justify-center items-center text-2xl">
          <p className="text-gray-200">Новых уведомлений нет</p>
        </div>
      </Card>
      <div className="flex flex-col gap-5">
        <Card className="w-[350px] flex justify-center items-center">
          <Clock className="font-bold text-6xl" />
        </Card>
        <Card className="w-[350px] h-[410px] flex justify-center p-2 items-center">
          <Calendar01 />
        </Card>
      </div>
    </div>
  );
}
