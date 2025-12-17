import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils/format-date";
import type { Employee } from "@/types/employee";
import type { EmployeeSelection } from "@/types/employee-selection";

interface Step1Props {
  plannedHours: number;
  setPlannedHours: (val: number) => void;
  employees: Employee[];
  employeeSelections: EmployeeSelection[];
  setEmployeeSelections: React.Dispatch<
    React.SetStateAction<EmployeeSelection[]>
  >;
  isTemplate?: boolean;
}

export default function Step1SelectHours({
  plannedHours,
  setPlannedHours,
  employees,
  employeeSelections,
  setEmployeeSelections,
  isTemplate = false,
}: Step1Props) {
  const hoursOptions = [7, 8, 9, 10, 11, 12];
  const employeeHoursOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const today = new Date();
  const formattedDate = formatDate(today.toISOString());

  // Изменение общего количества часов
  const handlePlannedHoursChange = (val: string) => {
    const hours = Number(val);
    setPlannedHours(hours);

    setEmployeeSelections((prev) =>
      prev.map((emp) => (emp.selected ? { ...emp, workedHours: hours } : emp))
    );
  };

  // Переключение выбора сотрудника
  const toggleEmployee = (employee: Employee) => {
    setEmployeeSelections((prev) => {
      const exists = prev.find((emp) => emp.id === employee.id);

      if (exists) {
        return prev.map((emp) =>
          emp.id === employee.id
            ? {
                ...emp,
                selected: !emp.selected,
                workedHours: !emp.selected ? plannedHours : null,
              }
            : emp
        );
      }

      return [
        ...prev,
        {
          id: employee.id,
          selected: true,
          workedHours: plannedHours || null,
          firstName: employee.firstName,
          lastName: employee.lastName,
          fatherName: employee.fatherName,
          position: employee.position,
          isLocal: false, // по умолчанию false
        },
      ];
    });
  };

  // Изменение количества часов для конкретного сотрудника
  const updateEmployeeHours = (id: string, hours: number) => {
    setEmployeeSelections((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, workedHours: hours } : emp))
    );
  };

  // Переключение isLocal для сотрудника
  const toggleIsLocal = (id: string) => {
    setEmployeeSelections((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, isLocal: !emp.isLocal } : emp
      )
    );
  };

  return (
    <div>
      {/* Верхняя панель */}
      <div className="bg-muted rounded-xl p-5 mb-5 shrink-0">
        <div className="flex flex-wrap items-center gap-6 mt-3">
          {!isTemplate && (
            <div className="flex items-center gap-3">
              <p className="font-medium text-blue-500">Дата:</p>
              <p className="font-medium">{formattedDate}</p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <p className="font-medium text-blue-500">Количество часов:</p>
            <Select
              value={plannedHours > 0 ? plannedHours.toString() : undefined}
              onValueChange={handlePlannedHoursChange}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Выберите часы" />
              </SelectTrigger>
              <SelectContent>
                {hoursOptions.map((hour) => (
                  <SelectItem key={hour} value={hour.toString()}>
                    {hour} ч
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Таблица сотрудников */}
      {plannedHours > 0 && (
        <div className="flex-1 rounded-md border p-3">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>Выбор</TableHead>
                <TableHead>Сотрудник</TableHead>
                <TableHead>Местный</TableHead>
                <TableHead>Должность</TableHead>
                <TableHead className="w-[172px]">Часы</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {employees.map((employee) => {
                const empState = employeeSelections.find(
                  (e) => e.id === employee.id
                );
                const selected = empState?.selected || false;
                const workedHours = empState?.workedHours ?? null;
                const isLocal = empState?.isLocal || false;

                return (
                  <TableRow
                    key={employee.id}
                    className={`${
                      selected ? "bg-muted" : "bg-transparent"
                    } h-[53px] hover:${
                      selected ? "bg-muted" : "bg-transparent"
                    }`}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selected}
                        onCheckedChange={() => toggleEmployee(employee)}
                      />
                    </TableCell>

                    <TableCell>
                      {employee.lastName} {employee.firstName}{" "}
                      {employee.fatherName || ""}
                    </TableCell>

                    <TableCell>
                      <Checkbox
                        checked={isLocal}
                        onCheckedChange={() => toggleIsLocal(employee.id)}
                      />
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">{employee.position}</Badge>
                    </TableCell>

                    <TableCell>
                      {selected ? (
                        <Select
                          value={
                            workedHours ? workedHours.toString() : undefined
                          }
                          onValueChange={(val) =>
                            updateEmployeeHours(employee.id, Number(val))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="—" />
                          </SelectTrigger>
                          <SelectContent>
                            {employeeHoursOptions.map((hour) => (
                              <SelectItem key={hour} value={hour.toString()}>
                                {hour} ч
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
