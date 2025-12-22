import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  totalEmployees: number;
  present: number;
  absent: number;
  totalHoursToday: number;
  totalHoursMonth: number;
};

export function MonitoringStats({
  totalEmployees,
  present,
  absent,
  totalHoursToday,
  totalHoursMonth,
}: Props) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6 mt-6">
      <Card className="flex flex-col items-center justify-center bg-table-blue">
        <CardHeader className="w-full">
          <CardTitle className="text-center text-xl">
            Всего сотрудников
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-3xl font-bold">{totalEmployees}</p>
        </CardContent>
      </Card>

      <Card className="flex flex-col items-center justify-center bg-table-green">
        <CardHeader className="w-full">
          <CardTitle className="text-center text-xl">Вышли на смены</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-3xl font-bold">{present}</p>
        </CardContent>
      </Card>

      <Card className="flex flex-col items-center justify-center bg-table-red">
        <CardHeader className="w-full">
          <CardTitle className="text-center text-xl">Не вышли</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-3xl font-bold">{absent}</p>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        <Card className="flex flex-col items-center justify-center bg-table-purple">
          <CardHeader className="w-full">
            <CardTitle className="text-center">Часы за сегодня</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-3xl font-bold">{totalHoursToday}</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center justify-center bg-table-orange">
          <CardHeader className="w-full">
            <CardTitle className="text-center">Часы за месяц</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-3xl font-bold">{totalHoursMonth}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
