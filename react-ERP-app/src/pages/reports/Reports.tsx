import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMemo, useState } from "react";
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
import { DatePicker } from "@/components/ui/date-picker";
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
function getDateRange(from: string, to: string): string[] {
  const result: string[] = [];
  const start = new Date(from);
  const end = new Date(to);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    result.push(d.toISOString().slice(0, 10));
  }

  return result;
}

/* ===================== component ===================== */
export function ReportPage() {
  const [activeTab, setActiveTab] = useState("shifts");
  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });

  /* ---------- draft filters (UI) ---------- */
  const [shiftObject, setShiftObject] = useState("");
  const [shiftDateFrom, setShiftDateFrom] = useState<string>();
  const [shiftDateTo, setShiftDateTo] = useState<string>();

  /* ---------- applied filters (query) ---------- */
  const [appliedFilters, setAppliedFilters] = useState<{
    objectId: string;
    fromDate: string;
    toDate: string;
  } | null>(null);

  /* ---------- query ---------- */
  const { data: shiftsData = [], isLoading } = useShiftsWithFilters(
    appliedFilters ?? {},
    Boolean(appliedFilters)
  );

  /* ===================== aggregation ===================== */
  const { dateColumns, rows, totalByDate, totalAll } = useMemo(() => {
    if (!appliedFilters) {
      return { dateColumns: [], rows: [], totalByDate: {}, totalAll: 0 };
    }

    const dates = getDateRange(appliedFilters.fromDate, appliedFilters.toDate);
    const totalByDate: Record<string, number> = Object.fromEntries(
      dates.map((d) => [d, 0])
    );
    let totalAll = 0;

    const employeesMap = new Map<
      string,
      {
        employeeId: string;
        employeeName: string;
        hoursByDate: Record<string, number>;
        totalHours: number;
      }
    >();

    shiftsData.forEach((shift: Shift) => {
      const date = shift.shiftDate.slice(0, 10);

      shift.employees.forEach((se) => {
        const emp = se.employee;
        if (!emp) return;

        if (!employeesMap.has(emp.id)) {
          employeesMap.set(emp.id, {
            employeeId: emp.id,
            employeeName: `${emp.lastName} ${emp.firstName.charAt(0)}.${
              emp.fatherName?.charAt(0) ?? ""
            }.`,
            hoursByDate: Object.fromEntries(dates.map((d) => [d, 0])),
            totalHours: 0,
          });
        }

        const hours = se.workedHours ?? 0;
        const row = employeesMap.get(emp.id)!;
        row.hoursByDate[date] += hours;
        row.totalHours += hours;

        totalByDate[date] += hours;
        totalAll += hours;
      });
    });

    return {
      dateColumns: dates,
      rows: Array.from(employeesMap.values()),
      totalByDate,
      totalAll,
    };
  }, [shiftsData, appliedFilters]);

  /* ===================== render ===================== */
  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full mt-6"
    >
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="tools">
          <Wrench className="h-4 w-4 mr-2" /> Инструмент
        </TabsTrigger>
        <TabsTrigger value="clothes">
          <Shirt className="h-4 w-4 mr-2" /> Одежда
        </TabsTrigger>
        <TabsTrigger value="shifts">
          <Clock className="h-4 w-4 mr-2" /> Смены
        </TabsTrigger>
        <TabsTrigger value="work-list">
          <ListChecks className="h-4 w-4 mr-2" /> Журналы
        </TabsTrigger>
      </TabsList>

      {/* ===================== SHIFTS ===================== */}
      <TabsContent value="shifts" className="space-y-4 mt-6">
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
                <Label>Дата с</Label>
                <DatePicker
                  selected={shiftDateFrom}
                  onSelect={setShiftDateFrom}
                />
              </div>
              <div className="space-y-2">
                <Label>Дата по</Label>
                <DatePicker selected={shiftDateTo} onSelect={setShiftDateTo} />
              </div>
            </div>

            <Button
              className="mt-4"
              disabled={!shiftObject || !shiftDateFrom || !shiftDateTo}
              onClick={() =>
                setAppliedFilters({
                  objectId: shiftObject,
                  fromDate: shiftDateFrom!,
                  toDate: `${shiftDateTo!}T23:59:59`,
                })
              }
            >
              Сгенерировать отчет
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle>Результаты</CardTitle>
                <CardDescription>Календарь рабочего времени</CardDescription>
              </div>
              {!isLoading && rows.length !== 0 && (
                <ReportShiftPDFButton
                  rows={rows}
                  objectName={shiftsData[0].object.name}
                />
              )}
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
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

                    {/* total row */}
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

                <div className="mt-4 text-right font-semibold">
                  Всего часов: {totalAll}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      {/* ===================== TOOLS ===================== */}
      <TabsContent value="tools" className="space-y-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Фильтры</CardTitle>
            <CardDescription>Отчет по инструменту</CardDescription>
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
                <Label>Дата с</Label>
                <DatePicker
                  selected={shiftDateFrom}
                  onSelect={setShiftDateFrom}
                />
              </div>
              <div className="space-y-2">
                <Label>Дата по</Label>
                <DatePicker selected={shiftDateTo} onSelect={setShiftDateTo} />
              </div>
            </div>

            <Button
              className="mt-4"
              disabled={!shiftObject || !shiftDateFrom || !shiftDateTo}
            >
              Сгенерировать отчет
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Отчет</CardTitle>
            <CardDescription>История инструмента</CardDescription>
          </CardHeader>

          <CardContent>
            <div>В РАЗРАБОТКЕ</div>
          </CardContent>
        </Card>
      </TabsContent>
      {/* ===================== CLOTHES ===================== */}
      <TabsContent value="clothes" className="space-y-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Фильтры</CardTitle>
            <CardDescription>Отчет по спец. одежде</CardDescription>
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
                <Label>Дата с</Label>
                <DatePicker
                  selected={shiftDateFrom}
                  onSelect={setShiftDateFrom}
                />
              </div>
              <div className="space-y-2">
                <Label>Дата по</Label>
                <DatePicker selected={shiftDateTo} onSelect={setShiftDateTo} />
              </div>
            </div>

            <Button
              className="mt-4"
              disabled={!shiftObject || !shiftDateFrom || !shiftDateTo}
            >
              Сгенерировать отчет
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Отчет</CardTitle>
            <CardDescription>История спец. одежды</CardDescription>
          </CardHeader>

          <CardContent>
            <div>В РАЗРАБОТКЕ</div>
          </CardContent>
        </Card>
      </TabsContent>
      {/* ===================== WORK-LiST ===================== */}
      <TabsContent value="work-list" className="space-y-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Фильтры</CardTitle>
            <CardDescription>Журналы о проделанных работах</CardDescription>
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
                <Label>Дата с</Label>
                <DatePicker
                  selected={shiftDateFrom}
                  onSelect={setShiftDateFrom}
                />
              </div>
              <div className="space-y-2">
                <Label>Дата по</Label>
                <DatePicker selected={shiftDateTo} onSelect={setShiftDateTo} />
              </div>
            </div>

            <Button
              className="mt-4"
              disabled={!shiftObject || !shiftDateFrom || !shiftDateTo}
            >
              Сгенерировать отчет
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Отчет</CardTitle>
            <CardDescription>Журналы</CardDescription>
          </CardHeader>

          <CardContent>
            <div>В РАЗРАБОТКЕ</div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
