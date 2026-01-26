import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import { Clock, ListChecks, Loader2, Shirt, Wrench } from "lucide-react";
import { useObjects } from "@/hooks/object/useObject";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Object } from "@/types/object";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useShiftsWithFilters } from "@/hooks/shift/useShift";
import type { Shift } from "@/types/shift";
import { ReportShiftPDFButton } from "@/components/dashboard/reports/pdf button/report-pdf-generate-shift";

/* ===================== utils ===================== */
function getMonthRange(year: number, month: number) {
  const from = new Date(year, month - 1, 1);
  const to = new Date(year, month, 0, 23, 59, 59);
  return {
    fromDate: from.toISOString(),
    toDate: to.toISOString(),
  };
}

function getDateRange(from: string, to: string): string[] {
  const result: string[] = [];
  const start = new Date(from);
  const end = new Date(to);

  const current = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
  );
  const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  while (current <= last) {
    const yyyy = current.getFullYear();
    const mm = String(current.getMonth() + 1).padStart(2, "0");
    const dd = String(current.getDate()).padStart(2, "0");
    result.push(`${yyyy}-${mm}-${dd}`);
    current.setDate(current.getDate() + 1);
  }
  return result;
}

/* ===================== constants ===================== */
const months = [
  { value: "1", label: "Январь" },
  { value: "2", label: "Февраль" },
  { value: "3", label: "Март" },
  { value: "4", label: "Апрель" },
  { value: "5", label: "Май" },
  { value: "6", label: "Июнь" },
  { value: "7", label: "Июль" },
  { value: "8", label: "Август" },
  { value: "9", label: "Сентябрь" },
  { value: "10", label: "Октябрь" },
  { value: "11", label: "Ноябрь" },
  { value: "12", label: "Декабрь" },
];

const years = Array.from({ length: 5 }, (_, i) => {
  const y = new Date().getFullYear() - i;
  return { value: String(y), label: String(y) };
});

/* ===================== component ===================== */
export function ReportPage() {
  const [activeTab, setActiveTab] = useState("shifts");
  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });

  const [shiftObject, setShiftObject] = useState("");
  const [shiftMonth, setShiftMonth] = useState<string>();
  const [shiftYear, setShiftYear] = useState<string>();
  const [appliedFilters, setAppliedFilters] = useState<{
    objectId: string;
    fromDate: string;
    toDate: string;
  } | null>(null);

  const { data: shiftsData = [], isLoading } = useShiftsWithFilters(
    appliedFilters ?? {},
    Boolean(appliedFilters),
  );

  /* ===================== aggregation ===================== */
  const { dateColumns, rows, totalByDate, totalAll } = useMemo(() => {
    if (!appliedFilters)
      return { dateColumns: [], rows: [], totalByDate: {}, totalAll: 0 };

    const dates = getDateRange(appliedFilters.fromDate, appliedFilters.toDate);
    const totalByDate: Record<string, number> = Object.fromEntries(
      dates.map((d) => [d, 0]),
    );
    let totalAll = 0;

    const employeesMap = new Map<
      string,
      {
        employeeId: string;
        employeeLastName: string;
        employeeFirstName: string;
        employeeFatherName: string;
        employeeName: string;
        hoursByDate: Record<string, number>;
        totalHours: number;
      }
    >();

    shiftsData.forEach((shift: Shift) => {
      shift.employees.forEach((se) => {
        const emp = se.employee;
        if (!emp) return;

        // Локальная дата shiftDate
        const shiftDate = new Date(shift.shiftDate);
        const year = shiftDate.getFullYear();
        const month = String(shiftDate.getMonth() + 1).padStart(2, "0");
        const day = String(shiftDate.getDate()).padStart(2, "0");
        const dateKey = `${year}-${month}-${day}`;

        if (!employeesMap.has(emp.id)) {
          employeesMap.set(emp.id, {
            employeeId: emp.id,
            employeeLastName: emp.lastName,
            employeeFirstName: emp.firstName,
            employeeFatherName: emp.fatherName ?? "",
            employeeName: `${emp.lastName} ${emp.firstName.charAt(0)}.${emp.fatherName?.charAt(0) ?? ""}.`,
            hoursByDate: Object.fromEntries(dates.map((d) => [d, 0])),
            totalHours: 0,
          });
        }

        const row = employeesMap.get(emp.id)!;
        const hours = se.workedHours ?? 0;

        // Увеличиваем часы
        row.hoursByDate[dateKey] += hours;
        row.totalHours += hours;
        if (dateKey in totalByDate) totalByDate[dateKey] += hours;
        totalAll += hours;
      });
    });

    const sortedRows = Array.from(employeesMap.values()).sort(
      (a, b) =>
        a.employeeLastName.localeCompare(b.employeeLastName) ||
        a.employeeFirstName.localeCompare(b.employeeFirstName) ||
        a.employeeFatherName.localeCompare(b.employeeFatherName),
    );

    return { dateColumns: dates, rows: sortedRows, totalByDate, totalAll };
  }, [shiftsData, appliedFilters]);

  useEffect(() => {
    setAppliedFilters(null);
  }, [shiftObject, shiftMonth, shiftYear]);

  /* ===================== render ===================== */
  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full mt-6"
    >
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger disabled value="tools">
          <Wrench className="h-4 w-4 mr-2" /> Инструмент
        </TabsTrigger>
        <TabsTrigger disabled value="clothes">
          <Shirt className="h-4 w-4 mr-2" /> Одежда
        </TabsTrigger>
        <TabsTrigger value="shifts">
          <Clock className="h-4 w-4 mr-2" /> Смены
        </TabsTrigger>
        <TabsTrigger disabled value="work-list">
          <ListChecks className="h-4 w-4 mr-2" /> Журналы
        </TabsTrigger>
      </TabsList>

      <TabsContent value="shifts" className="space-y-4 mt-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Фильтры</CardTitle>
            <CardDescription>
              Отчет по рабочим сменам сотрудников
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Объект</Label>
              <Select value={shiftObject} onValueChange={setShiftObject}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите объект" />
                </SelectTrigger>
                <SelectContent>
                  {objects.map((obj: Object) => (
                    <SelectItem key={obj.id} value={obj.id}>
                      {obj.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-6">
              <div className="space-y-2">
                <Label>Месяц</Label>
                <Select value={shiftMonth} onValueChange={setShiftMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder="Месяц" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Год</Label>
                <Select value={shiftYear} onValueChange={setShiftYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Год" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y.value} value={y.value}>
                        {y.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              className="mt-4"
              disabled={!shiftObject || !shiftMonth || !shiftYear}
              onClick={() => {
                const { fromDate, toDate } = getMonthRange(
                  Number(shiftYear),
                  Number(shiftMonth),
                );
                setAppliedFilters({ objectId: shiftObject, fromDate, toDate });
              }}
            >
              Сформировать отчет
            </Button>
          </CardContent>
        </Card>

        {/* Result Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle>Результаты</CardTitle>
                <CardDescription>Календарь рабочего времени</CardDescription>
              </div>
              {!isLoading && rows.length !== 0 && (
                <ReportShiftPDFButton
                  month={shiftMonth ? months[Number(shiftMonth) - 1].label : ""}
                  year={shiftYear || ""}
                  rows={rows.filter((row) => row.totalHours !== 0)}
                  objectName={shiftsData[0]?.object.name}
                />
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!appliedFilters ? (
              <div className="text-center py-12 text-muted-foreground">
                Выберите параметры и нажмите «Сформировать отчет»
              </div>
            ) : isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : rows.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Нет данных
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background border-r min-w-[200px]">
                        Сотрудник
                      </TableHead>
                      {dateColumns.map((date) => (
                        <TableHead
                          key={date}
                          className="text-center min-w-[40px]"
                        >
                          {new Intl.DateTimeFormat("ru-RU", {
                            day: "2-digit",
                            month: "2-digit",
                          }).format(new Date(date))}
                        </TableHead>
                      ))}
                      <TableHead className="text-center min-w-[60px]">
                        Итого
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.employeeId}>
                        <TableCell className="sticky left-0 bg-background border-r font-medium">
                          {row.employeeName}
                        </TableCell>
                        {dateColumns.map((date) => (
                          <TableCell key={date} className="text-center">
                            <span
                              className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                                row.hoursByDate[date] >= 8
                                  ? "bg-green-500/10 text-green-700"
                                  : row.hoursByDate[date] > 0
                                    ? "bg-orange-500/10 text-orange-700"
                                    : "bg-gray-500/10 text-gray-500"
                              }`}
                            >
                              {row.hoursByDate[date]}
                            </span>
                          </TableCell>
                        ))}
                        <TableCell className="text-center font-medium">
                          {row.totalHours}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell className="sticky left-0 bg-background border-r">
                        Итого
                      </TableCell>
                      {dateColumns.map((date) => (
                        <TableCell key={date} className="text-center">
                          {totalByDate[date]}
                        </TableCell>
                      ))}
                      <TableCell className="text-center">{totalAll}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
