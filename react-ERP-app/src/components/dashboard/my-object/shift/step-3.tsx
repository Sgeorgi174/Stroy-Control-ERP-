import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

interface Step3AbsenceReasonProps {
  employeeSelections: EmployeeSelection[];
  setEmployeeSelections: React.Dispatch<
    React.SetStateAction<EmployeeSelection[]>
  >;
}

export default function Step3AbsenceReason({
  employeeSelections,
  setEmployeeSelections,
}: Step3AbsenceReasonProps) {
  // Отфильтровываем только отсутствующих
  const absentEmployees = employeeSelections.filter((emp) => !emp.selected);

  const handleAbsenceChange = (id: string, value: string) => {
    setEmployeeSelections((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, absenceReason: value } : emp
      )
    );
  };

  if (absentEmployees.length === 0) {
    return (
      <p className="text-gray-500">
        Все сотрудники выбраны для работы. Отсутствующие отсутствуют.
      </p>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-medium mb-4">
        Укажите причину отсутствия сотрудников
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Сотрудник</TableHead>
            <TableHead>Должность</TableHead>
            <TableHead>Причина отсутствия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {absentEmployees.map((emp) => (
            <TableRow key={emp.id} className="h-[53px]">
              <TableCell>
                {emp.firstName} {emp.lastName}
              </TableCell>
              <TableCell>
                {<Badge variant="outline">{emp.position}</Badge>}
              </TableCell>
              <TableCell>
                <Input
                  placeholder="Введите причину отсутствия"
                  value={emp.absenceReason || ""}
                  onChange={(e) => handleAbsenceChange(emp.id, e.target.value)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
