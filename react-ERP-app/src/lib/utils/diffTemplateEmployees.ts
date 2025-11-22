import type { Employee } from "@/types/employee";
import type { ShiftTemplate } from "@/types/shift";

export function diffTemplateEmployees({
  template,
  currentEmployees,
}: {
  template: ShiftTemplate;
  currentEmployees: Employee[];
}) {
  const removedEmployees = template.employees.filter(
    (tpl) => !currentEmployees.some((emp) => emp.id === tpl.employeeId)
  );

  const newEmployees = currentEmployees.filter(
    (emp) => !template.employees.some((tpl) => tpl.employeeId === emp.id)
  );

  return {
    removedEmployees,
    newEmployees,
  };
}
