import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { EmployeeSelection } from "@/types/employee-selection";
import { Check } from "lucide-react";

interface Step4SummaryProps {
  employeeSelections: EmployeeSelection[];
  onFinish?: () => void;
}

export default function Step4Summary({
  employeeSelections,
}: Step4SummaryProps) {
  const selectedEmployees = employeeSelections.filter((e) => e.selected);
  const absentEmployees = employeeSelections.filter((e) => !e.selected);

  console.log(employeeSelections);

  return (
    <div className="flex-1 overflow-y-auto space-y-6 p-3 border rounded-md">
      <div>
        <h3 className="text-xl font-medium mb-4">
          Сотрудники с назначенными задачами
        </h3>
        {selectedEmployees.length === 0 ? (
          <p className="text-gray-500">Нет выбранных сотрудников.</p>
        ) : (
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
              <TableRow>
                <TableHead className="w-[250px]">Сотрудник</TableHead>
                <TableHead className="w-[100px]">Местный</TableHead>
                <TableHead className="w-[150px]">Часы</TableHead>
                <TableHead>Задача</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedEmployees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>
                    {`${emp.lastName} ${emp.firstName.charAt(
                      0
                    )}.${emp.fatherName.charAt(0)}.`}
                  </TableCell>
                  <TableCell className="pl-6">
                    {emp.isLocal ? <Check className="w-[18px]" /> : ""}
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
            <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
              <TableRow>
                <TableHead className="w-[250px]">Сотрудник</TableHead>
                <TableHead className="w-[100px]">Местный</TableHead>
                <TableHead className="w-[150px]">Часы</TableHead>
                <TableHead>Причина отсутствия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {absentEmployees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>
                    {`${emp.lastName} ${emp.firstName.charAt(
                      0
                    )}.${emp.fatherName.charAt(0)}.`}
                  </TableCell>
                  <TableCell className="pl-6">
                    {emp.isLocal ? <Check className="w-[18px]" /> : ""}
                  </TableCell>
                  <TableCell>{0}</TableCell>
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
