import { useState } from "react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, CalendarIcon, AlertTriangle } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { ru } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useCreateWorkLog } from "@/hooks/work-log/useWorkLog";
import { Label } from "@/components/ui/label";
import type { WorkLog } from "@/types/work-log";

const formSchema = z.object({
  date: z.date({ required_error: "Выберите дату" }),
  items: z
    .array(
      z.object({
        text: z.string().min(1, "Поле не может быть пустым"),
      }),
    )
    .min(1),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateWorkLogDialog({
  objectId,
  existingLogs,
}: {
  objectId: string;
  existingLogs: WorkLog[];
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { mutate: createLog, isPending } = useCreateWorkLog(objectId);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      items: [{ text: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Следим за выбранной датой в форме
  const selectedDate = watch("date");

  // Проверяем, есть ли уже запись на выбранную дату
  const isDateAlreadyLogged = existingLogs.some((log) =>
    isSameDay(new Date(log.date), selectedDate),
  );

  const handleClose = () => {
    setIsDialogOpen(false);
    reset({ date: new Date(), items: [{ text: "" }] });
  };

  const onSubmit = (values: FormValues) => {
    if (isDateAlreadyLogged) return; // Страховка

    createLog(
      {
        objectId,
        date: values.date.toISOString(),
        items: values.items,
      },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
        setIsDialogOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" /> Новая запись
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить запись</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="flex flex-col gap-2">
            <Label>Дата работ</Label>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <div className="relative">
                  <div className="sm:hidden">
                    <Input
                      type="date"
                      className="w-full h-10"
                      value={
                        field.value ? format(field.value, "yyyy-MM-dd") : ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? new Date(e.target.value)
                            : new Date(),
                        )
                      }
                      max={format(new Date(), "yyyy-MM-dd")}
                    />
                  </div>

                  <div className="hidden sm:block">
                    <Popover
                      open={isCalendarOpen}
                      onOpenChange={setIsCalendarOpen}
                      modal={false}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-10",
                            isDateAlreadyLogged &&
                              "border-destructive text-destructive",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? format(field.value, "PPP", { locale: ru })
                            : "Выберите дату"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setIsCalendarOpen(false);
                          }}
                          disabled={(date) => date > new Date()}
                          locale={ru}
                          weekStartsOn={1}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            />

            {/* Предупреждение о дубликате */}
            {isDateAlreadyLogged && (
              <div className="flex items-center gap-2 text-destructive text-sm font-medium mt-1 animate-in fade-in slide-in-from-top-1">
                <AlertTriangle className="h-4 w-4" />
                Запись за {format(selectedDate, "dd.MM.yyyy")} уже существует
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Label>Перечень выполненных работ</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-1">
                <div className="flex gap-2">
                  <Input
                    {...register(`items.${index}.text` as const)}
                    placeholder="Что было сделано..."
                    className={cn(
                      errors.items?.[index]?.text && "border-destructive",
                    )}
                  />
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-destructive shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full border-dashed"
              onClick={() => append({ text: "" })}
            >
              <Plus className="h-4 w-4 mr-2" /> Добавить строку
            </Button>
          </div>

          <div className="pt-4 border-t">
            <Button
              type="submit"
              className="w-full h-11 text-base"
              disabled={isPending || isDateAlreadyLogged}
            >
              {isPending
                ? "Сохранение..."
                : isDateAlreadyLogged
                  ? "Запись уже есть"
                  : "Сохранить запись"}
            </Button>
            {isDateAlreadyLogged && (
              <p className="text-[10px] text-center text-muted-foreground mt-2">
                Вы не можете создать вторую запись за один и тот же день.
              </p>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
