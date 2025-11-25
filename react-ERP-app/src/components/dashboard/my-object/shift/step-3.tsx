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
import type { EmployeeSelection } from "@/types/employee-selection";

interface Step3AbsenceReasonProps {
  employeeSelections: EmployeeSelection[];
  setEmployeeSelections: React.Dispatch<
    React.SetStateAction<EmployeeSelection[]>
  >;
  onNext?: () => void;
}

export default function Step3AbsenceReason({
  employeeSelections,
  setEmployeeSelections,
}: Step3AbsenceReasonProps) {
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
        Все сотрудники выбраны для работы. Отсутствующих нет.
      </p>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-medium mb-4">
        Укажите причину отсутствия сотрудников
      </h3>

      <div className="flex-1 overflow-y-auto rounded-md border p-3">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
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
                  {`${emp.lastName} ${emp.firstName.charAt(
                    0
                  )}.${emp.fatherName.charAt(0)}.`}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{emp.position}</Badge>
                </TableCell>
                <TableCell>
                  <Input
                    id={`absence-${emp.id}`}
                    name="employee-absence"
                    placeholder="Введите причину отсутствия"
                    value={emp.absenceReason || ""}
                    onChange={(e) =>
                      handleAbsenceChange(emp.id, e.target.value)
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
