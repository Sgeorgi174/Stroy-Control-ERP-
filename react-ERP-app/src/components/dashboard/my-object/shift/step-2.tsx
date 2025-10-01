import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { positionMap } from "@/constants/positionMap";
import type { Positions } from "@/types/employee";
import { Badge } from "@/components/ui/badge";

interface EmployeeSelection {
  id: string;
  selected: boolean;
  workedHours: number | null;
  firstName: string;
  lastName: string;
  position: Positions;
  task?: string;
}

interface Step2AssignTasksProps {
  employeeSelections: EmployeeSelection[];
  setEmployeeSelections: React.Dispatch<
    React.SetStateAction<EmployeeSelection[]>
  >;
}

export default function Step2AssignTasks({
  employeeSelections,
  setEmployeeSelections,
}: Step2AssignTasksProps) {
  const handleTaskChange = (id: string, value: string) => {
    setEmployeeSelections((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, task: value } : emp))
    );
  };

  // Фильтруем выбранных сотрудников для отображения
  const selectedEmployees = employeeSelections.filter((emp) => emp.selected);

  if (selectedEmployees.length === 0) {
    return (
      <p className="text-gray-500">
        Нет выбранных сотрудников для назначения задач.
      </p>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-medium mb-4">
        Назначение задач выбранным сотрудникам
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Сотрудник</TableHead>
            <TableHead>Должность</TableHead>
            <TableHead>Часы</TableHead>
            <TableHead>Задача</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedEmployees.map((emp) => (
            <TableRow key={emp.id} className="h-[53px]">
              <TableCell>
                {emp.firstName} {emp.lastName}
              </TableCell>
              <TableCell>
                {<Badge variant="outline">{positionMap[emp.position]}</Badge>}
              </TableCell>
              <TableCell>{emp.workedHours ?? "—"}</TableCell>
              <TableCell>
                <Input
                  placeholder="Опишите задачу"
                  value={emp.task || ""}
                  onChange={(e) => handleTaskChange(emp.id, e.target.value)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
