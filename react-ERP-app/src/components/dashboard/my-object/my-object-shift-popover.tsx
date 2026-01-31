import { useEffect, useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table2 } from "lucide-react";
import { useShiftsWithFilters } from "@/hooks/shift/useShift";
import type { Shift } from "@/types/shift";
import { ReportShiftPDFButton } from "@/components/dashboard/reports/pdf button/report-pdf-generate-shift";

/* ===== helpers ===== */
function getMonthRange(year: number, month: number) {
  const from = new Date(year, month - 1, 1);
  const to = new Date(year, month, 0, 23, 59, 59);
  return {
    fromDate: from.toISOString(),
    toDate: to.toISOString(),
  };
}

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

/* ===== component ===== */
type ReportShiftPopoverProps = {
  objectId: string;
  objectName: string;
};

export function ReportShiftPopover({
  objectId,
  objectName,
}: ReportShiftPopoverProps) {
  const [month, setMonth] = useState<string>();
  const [year, setYear] = useState<string>();
  const [applied, setApplied] = useState<{
    fromDate: string;
    toDate: string;
  } | null>(null);

  const { data: shifts = [] } = useShiftsWithFilters(
    applied
      ? { objectId, fromDate: applied.fromDate, toDate: applied.toDate }
      : {},
    Boolean(applied),
  );

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

  /* ===== aggregation + SORT ===== */
  const { rows } = useMemo(() => {
    if (!applied) return { rows: [] };

    const dates = getDateRange(applied.fromDate, applied.toDate);

    const employeesMap = new Map<
      string,
      {
        employeeId: string;
        lastName: string;
        firstName: string;
        fatherName: string;
        employeeName: string;
        hoursByDate: Record<string, number>;
        totalHours: number;
      }
    >();

    shifts.forEach((shift: Shift) => {
      const shiftDate = new Date(shift.shiftDate);
      const yyyy = shiftDate.getFullYear();
      const mm = String(shiftDate.getMonth() + 1).padStart(2, "0");
      const dd = String(shiftDate.getDate()).padStart(2, "0");
      const dateKey = `${yyyy}-${mm}-${dd}`;

      shift.employees.forEach((se) => {
        const emp = se.employee;
        if (!emp) return;

        if (!employeesMap.has(emp.id)) {
          employeesMap.set(emp.id, {
            employeeId: emp.id,
            lastName: emp.lastName,
            firstName: emp.firstName,
            fatherName: emp.fatherName ?? "",
            employeeName: `${emp.lastName} ${emp.firstName.charAt(0)}.${emp.fatherName?.charAt(0) ?? ""}.`,
            hoursByDate: Object.fromEntries(dates.map((d) => [d, 0])),
            totalHours: 0,
          });
        }

        const row = employeesMap.get(emp.id)!;
        const hours = se.workedHours ?? 0;

        row.hoursByDate[dateKey] += hours;
        row.totalHours += hours;
      });
    });

    const sortedRows = Array.from(employeesMap.values())
      .filter((r) => r.totalHours > 0)
      .sort((a, b) => {
        const last = a.lastName.localeCompare(b.lastName, "ru");
        if (last !== 0) return last;

        const first = a.firstName.localeCompare(b.firstName, "ru");
        if (first !== 0) return first;

        return a.fatherName.localeCompare(b.fatherName, "ru");
      });

    return { rows: sortedRows };
  }, [shifts, applied]);

  useEffect(() => {
    setApplied(null);
  }, [month, year]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="w-[45%]">
          <Table2 />
          Получить табель
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 flex flex-col gap-4">
        <p className="font-medium">Период табеля</p>

        <div className="flex gap-4">
          <Select value={month} onValueChange={setMonth}>
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

          <Select value={year} onValueChange={setYear}>
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

        <Button
          className="w-full"
          disabled={!month || !year}
          onClick={() => {
            const range = getMonthRange(Number(year), Number(month));
            setApplied(range);
          }}
        >
          Сформировать
        </Button>

        {applied && rows.length > 0 && (
          <ReportShiftPDFButton
            month={months[Number(month!) - 1].label}
            year={year!}
            rows={rows}
            objectName={objectName}
          />
        )}

        {applied && rows.length === 0 && (
          <div className="flex justify-center p-2 border-2 rounded-xl border-accent text-muted-foreground">
            Нет данных за выбранный период
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
