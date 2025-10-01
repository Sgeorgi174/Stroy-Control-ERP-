import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Positions } from "@/types/employee";

interface EmployeeSelection {
  id: string;
  selected: boolean;
  workedHours: number | null;
  firstName: string;
  lastName: string;
  position: Positions;
  task?: string;
  absenceReason?: string;
}

interface Step4SummaryProps {
  employeeSelections: EmployeeSelection[];
}

export default function Step4Summary({
  employeeSelections,
}: Step4SummaryProps) {
  const selectedEmployees = employeeSelections.filter((e) => e.selected);
  const absentEmployees = employeeSelections.filter((e) => !e.selected);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium mb-4">
          Сотрудники с назначенными задачами
        </h3>
        {selectedEmployees.length === 0 ? (
          <p className="text-gray-500">Нет выбранных сотрудников.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Сотрудник</TableHead>
                <TableHead>Часы</TableHead>
                <TableHead>Задача</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedEmployees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>
                    {emp.firstName} {emp.lastName}
                  </TableCell>
                  <TableCell>{emp.workedHours ?? "—"}</TableCell>
                  <TableCell>{emp.task || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div>
        <h3 className="text-xl font-medium mb-4">Отсутствующие сотрудники</h3>
        {absentEmployees.length === 0 ? (
          <p className="text-gray-500">Нет отсутствующих сотрудников.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Сотрудник</TableHead>
                <TableHead>Причина отсутствия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {absentEmployees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>
                    {emp.firstName} {emp.lastName}
                  </TableCell>
                  <TableCell>{emp.absenceReason || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
