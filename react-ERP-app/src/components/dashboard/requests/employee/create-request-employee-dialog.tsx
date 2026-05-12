import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreatePenalty,
  useUpdatePenalty,
} from "@/hooks/penalties/usePenalties";
import type { EmployeePenalty } from "@/types/penalty";
import { DatePicker } from "@/components/ui/date-picker";
import { RussianRuble, Loader2 } from "lucide-react";
import type { CreateEmployeePenaltyDto } from "@/types/dto/penalty.dto";
import { useEmployees } from "@/hooks/employee/useEmployees";
import { EmployeeAutocomplete } from "../../select-employee-for-form";
import { ObjectSelectForForms } from "../../select-object-for-form";
import { useObjects } from "@/hooks/object/useObject";

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: EmployeePenalty | null;
}

export function PenaltyCreateDialog({
  open,
  onOpenChange,
  initialData,
}: Props) {
  const isEdit = !!initialData;

  const { data: employees = [], isLoading: isEmployeesLoading } = useEmployees({
    searchQuery: "",
    objectId: "all",
    type: "ACTIVE",
  });

  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });

  const [form, setForm] = useState<
    Omit<CreateEmployeePenaltyDto, "date"> & { date: string }
  >({
    employeeId: "",
    amount: 0,
    reason: "",
    description: "",
    date: getTodayString(),
    objectId: "",
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        const d = new Date(initialData.createdAt);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

        setForm({
          employeeId: initialData.employee.id,
          amount: initialData.amount,
          reason: initialData.reason,
          description: initialData.description || "",
          date: dateStr,
          objectId: initialData.object.id,
        });
      } else {
        setForm({
          employeeId: "",
          amount: 0,
          reason: "",
          description: "",
          date: getTodayString(),
          objectId: "",
        });
      }
    }
  }, [initialData, open]);

  const createMutation = useCreatePenalty();
  const updateMutation = useUpdatePenalty(initialData?.id || "");
  const currentMutation = isEdit ? updateMutation : createMutation;

  const handleSubmit = () => {
    // Создаем копию данных, гарантируя, что date корректна
    const payload = {
      ...form,
      // Добавляем T00:00:00, чтобы new Date() на сервере не "прыгнул" на день назад
      date: `${form.date}T00:00:00.000Z`,
    };

    currentMutation.mutate(payload, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  const isValid =
    form.employeeId &&
    form.objectId && // Добавил проверку объекта в валидацию
    form.reason.trim().length > 0 &&
    form.amount > 0 &&
    form.date;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[850px] max-h-[90%] overflow-auto">
        <DialogHeader className="mb-6">
          <DialogTitle>
            {isEdit ? "Редактирование заявки" : "Создание новой заявки"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-8">
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <Label>Сотрудник</Label>
              {isEmployeesLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground h-10">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Загрузка...
                </div>
              ) : (
                <EmployeeAutocomplete
                  width="400"
                  employees={employees}
                  selectedEmployeeId={form.employeeId}
                  onSelectChange={(id) => setForm({ ...form, employeeId: id })}
                />
              )}
            </div>

            <div className="space-y-2 flex flex-col">
              <Label>Дата нарушения</Label>
              <DatePicker
                selected={form.date}
                onSelect={(date) =>
                  setForm({ ...form, date: date || getTodayString() })
                }
              />
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <Label htmlFor="reason">Причина</Label>
              <Input
                placeholder="Напр: Прогул, Порча имущества..."
                className="w-[400px]"
                id="reason"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
              />
            </div>
            <div className="space-y-2 flex flex-col">
              <Label htmlFor="amount">Сумма штрафа</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  className="pr-7 w-[300px]"
                  value={form.amount || ""}
                  onChange={(e) =>
                    setForm({ ...form, amount: Number(e.target.value) })
                  }
                />
                <RussianRuble className="w-3 h-3 absolute right-2 top-3 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <Label>Объект</Label>
              <ObjectSelectForForms
                className="w-[400px]"
                objects={objects}
                selectedObjectId={form.objectId}
                onSelectChange={(id) =>
                  setForm({ ...form, objectId: id || "" })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание ситуации</Label>
            <Textarea
              id="description"
              className="min-h-[120px] resize-none"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || currentMutation.isPending}
          >
            {isEdit ? "Сохранить изменения" : "Отправить на согласование"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
