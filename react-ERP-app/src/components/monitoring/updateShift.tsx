import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import type { Shift } from "@/types/shift";
import {
  loadTaskHistory,
  saveTaskHistory,
} from "@/lib/utils/task-absence-history";
import type { EmployeeSelection } from "@/types/employee-selection";
import { useUpdateShift } from "@/hooks/shift/useShift";
import Step1SelectHours from "../dashboard/my-object/shift/step-1";
import Step2AssignTasks from "../dashboard/my-object/shift/step-2";
import Step3AbsenceReason from "../dashboard/my-object/shift/step-3";
import Step4Summary from "../dashboard/my-object/shift/step-4";
import { Textarea } from "../ui/textarea";
import { Plus, Trash } from "lucide-react";
import { AddEmployeeToShiftDialog } from "./add-employee-shift-dialog";
import type { Employee } from "@/types/employee";
import { RemoveEmployeeFromShiftDialog } from "./remove-employee-shift-dialog";

interface ShiftEditDialogProps {
  shift: Shift;
  open: boolean;
  onClose: () => void;
}

export function ShiftEditDialog({
  shift,
  open,
  onClose,
}: ShiftEditDialogProps) {
  const [step, setStep] = useState(1);
  const prevStepRef = useRef(step);

  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const [plannedHours, setPlannedHours] = useState(shift.plannedHours);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  const [employeeSelections, setEmployeeSelections] = useState<
    EmployeeSelection[]
  >([]);
  const [employeesFromShift, setEmployeesFromShift] = useState<Employee[]>([]);

  const [taskHistory, setTaskHistory] = useState<string[]>([]);
  const [updatedReason, setUpdatedReason] = useState(shift.updatedReason ?? "");

  const updateShiftMutation = useUpdateShift(shift.id);

  // --- загрузка истории задач при открытии ---
  useEffect(() => {
    setTaskHistory(loadTaskHistory());
  }, []);

  // --- заполнение сотрудников данными из шаблона ---
  useEffect(() => {
    if (!shift.employees.length) return;

    const sortedEmployees = shift.employees
      .map((s) => s.employee)
      .sort((a, b) => a.lastName.localeCompare(b.lastName));

    setEmployeesFromShift(sortedEmployees);

    const sortedSelections = shift.employees
      .map((s) => ({
        id: s.employeeId,
        selected: s.present,
        workedHours: s.workedHours,
        task: s.task,
        absenceReason: s.absenceReason,
        isLocal: s.isLocal,
        firstName: s.employee.firstName,
        lastName: s.employee.lastName,
        fatherName: s.employee.fatherName,
        position: s.employee.position,
      }))
      .sort((a, b) => a.lastName.localeCompare(b.lastName));

    setEmployeeSelections(sortedSelections);
  }, [shift]);

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
    const employeesForUpdate = employeeSelections.map((emp) => ({
      employeeId: emp.id,
      workedHours: emp.workedHours || 0,
      present: emp.selected,
      task: emp.task,
      absenceReason: emp.absenceReason,
      isLocal: emp.isLocal,
    }));

    updateShiftMutation.mutate(
      {
        objectId: shift.objectId,
        plannedHours: plannedHours,
        employees: employeesForUpdate,
        updatedReason: updatedReason,
        shiftDate: shift.shiftDate,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[1250px] sm:max-w-[1250px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between">
            <p className="text-2xl font-bold">Редактирование смены</p>
            <div className="flex gap-5 mr-20">
              <Button onClick={() => setAddDialogOpen(true)}>
                <Plus />
                Добавить сотрудника
              </Button>
              <Button
                variant="destructive"
                onClick={() => setRemoveDialogOpen(true)}
              >
                {" "}
                <Trash /> Удалить сотрудника{" "}
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* ШАГ 1 */}
        {step === 1 && (
          <Step1SelectHours
            isTemplate
            employees={employeesFromShift}
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

        {/* ШАГ 5 */}
        {step === 5 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold">Причина изменения смены</h3>
            <p className="text-sm text-muted-foreground">
              Укажите, почему вы изменяете данные смены. Это необходимо для
              истории.
            </p>

            <Textarea
              value={updatedReason}
              onChange={(e) => setUpdatedReason(e.target.value)}
              placeholder="Например: сотрудник сообщил уточнённые часы, корректировка по задаче..."
              className="min-h-[120px]"
            />
          </div>
        )}

        <DialogFooter className="flex justify-between mt-4">
          <Button variant="outline" onClick={prevStep} disabled={step === 0}>
            Назад
          </Button>

          {step < 5 ? (
            <Button onClick={nextStep}>Далее</Button>
          ) : (
            <Button
              onClick={handleSaveChanges}
              disabled={updateShiftMutation.isPending}
            >
              Сохранить изменения
            </Button>
          )}
        </DialogFooter>

        <AddEmployeeToShiftDialog
          setEmployeesFromShift={setEmployeesFromShift}
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          employeeSelections={employeeSelections}
          setEmployeeSelections={setEmployeeSelections}
        />

        <RemoveEmployeeFromShiftDialog
          setEmployeesFromShift={setEmployeesFromShift}
          open={removeDialogOpen}
          onClose={() => setRemoveDialogOpen(false)}
          employeeSelections={employeeSelections}
          setEmployeeSelections={setEmployeeSelections}
        />
      </DialogContent>
    </Dialog>
  );
}
