import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { useEmployees } from "@/hooks/employee/useEmployees";
import { useUpdateShiftTemplate } from "@/hooks/shift-template/useShiftTemplate";

import Step1SelectHours from "./step-1";
import Step2AssignTasks from "./step-2";
import Step3AbsenceReason from "./step-3";
import Step4Summary from "./step-4";

import type { ShiftTemplate } from "@/types/shift";
import type { Positions } from "@/types/employee";
import {
  loadTaskHistory,
  saveTaskHistory,
} from "@/lib/utils/task-absence-history";

interface ShiftTemplateEditDialogProps {
  template: ShiftTemplate;
  open: boolean;
  onClose: () => void;
}

export function ShiftTemplateEditDialog({
  template,
  open,
  onClose,
}: ShiftTemplateEditDialogProps) {
  const [step, setStep] = useState(0);
  const prevStepRef = useRef(step);

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const [templateName, setTemplateName] = useState(template.name);
  const [plannedHours, setPlannedHours] = useState(template.plannedHours);

  const [employeeSelections, setEmployeeSelections] = useState<
    {
      id: string;
      selected: boolean;
      workedHours: number | null;
      firstName: string;
      lastName: string;
      position: Positions;
      task?: string;
      absenceReason?: string;
    }[]
  >([]);

  const [taskHistory, setTaskHistory] = useState<string[]>([]);

  const { data: employees = [] } = useEmployees({
    objectId: template.objectId,
    searchQuery: "",
    type: "ACTIVE",
  });

  const updateTemplateMutation = useUpdateShiftTemplate(template.id);

  // --- загрузка истории задач при открытии ---
  useEffect(() => {
    setTaskHistory(loadTaskHistory());
  }, []);

  // --- заполнение сотрудников данными из шаблона ---
  useEffect(() => {
    if (!employees.length) return;

    setEmployeeSelections(
      employees.map((emp) => {
        const fromTemplate = template.employees.find(
          (t) => t.employeeId === emp.id
        );

        return {
          id: emp.id,
          selected: fromTemplate?.present ?? false,
          workedHours: fromTemplate?.workedHours ?? null,
          firstName: emp.firstName,
          lastName: emp.lastName,
          position: emp.position,
          task: fromTemplate?.task,
          absenceReason: fromTemplate?.absenceReason,
        };
      })
    );
  }, [employees, template]);

  // --- сохранение истории задач при смене шага ---
  useEffect(() => {
    if (prevStepRef.current !== step) {
      const newTasks = employeeSelections
        .map((emp) => emp.task)
        .filter((t): t is string => !!t);

      const updated = saveTaskHistory(taskHistory, newTasks);
      setTaskHistory(updated);

      prevStepRef.current = step;
    }
  }, [step, employeeSelections, taskHistory]);

  const handleSaveChanges = () => {
    if (!templateName.trim()) {
      alert("Введите название шаблона");
      return;
    }

    const employeesForTemplate = employeeSelections.map((emp) => ({
      employeeId: emp.id,
      workedHours: emp.workedHours || 0,
      present: emp.selected,
      task: emp.task,
      absenceReason: emp.absenceReason,
    }));

    updateTemplateMutation.mutate(
      {
        name: templateName,
        plannedHours,
        employees: employeesForTemplate,
        objectId: template.objectId,
      },
      {
        onSuccess: () => {
          onClose();
          setStep(0);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Редактирование шаблона
          </DialogTitle>
        </DialogHeader>

        {/* ШАГ 0 */}
        {step === 0 && (
          <div className="flex flex-col gap-4 py-4">
            <label className="font-medium">Название шаблона</label>
            <Input
              id="shift-name"
              autoComplete="on"
              name="shift-name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>
        )}

        {/* ШАГ 1 */}
        {step === 1 && (
          <Step1SelectHours
            employees={employees}
            plannedHours={plannedHours}
            setPlannedHours={setPlannedHours}
            employeeSelections={employeeSelections}
            setEmployeeSelections={setEmployeeSelections}
          />
        )}

        {/* ШАГ 2 */}
        {step === 2 && (
          <Step2AssignTasks
            employeeSelections={employeeSelections}
            setEmployeeSelections={setEmployeeSelections}
            taskHistory={taskHistory} // передаём подсказки
          />
        )}

        {/* ШАГ 3 */}
        {step === 3 && (
          <Step3AbsenceReason
            employeeSelections={employeeSelections}
            setEmployeeSelections={setEmployeeSelections}
          />
        )}

        {/* ШАГ 4 */}
        {step === 4 && <Step4Summary employeeSelections={employeeSelections} />}

        <DialogFooter className="flex justify-between mt-4">
          <Button variant="outline" onClick={prevStep} disabled={step === 0}>
            Назад
          </Button>

          {step < 4 ? (
            <Button onClick={nextStep}>Далее</Button>
          ) : (
            <Button
              onClick={handleSaveChanges}
              disabled={updateTemplateMutation.isPending}
            >
              Сохранить изменения
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
