import { useEffect, useState } from "react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Plus,
  Trash2,
  CalendarIcon,
  AlertTriangle,
  ImagePlus,
  X,
} from "lucide-react";
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
import {
  loadWorkLogTaskHistory,
  saveWorkLogTaskHistory,
} from "@/lib/utils/work-log-history-item";

const formSchema = z.object({
  date: z.date({ required_error: "Выберите дату" }),
  items: z
    .array(z.object({ text: z.string().min(1, "Поле не может быть пустым") }))
    .min(1, "Добавьте хотя бы одну работу"),
  photos: z.array(z.any()).max(3, "Максимум 3 фотографии").optional(),
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
  const [previews, setPreviews] = useState<string[]>([]);
  const [taskHistory, setTaskHistory] = useState<string[]>([]);

  const { mutate: createLog, isPending } = useCreateWorkLog(objectId);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      items: [{ text: "" }],
      photos: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const selectedDate = watch("date");
  const photos = watch("photos") || [];

  const isDateAlreadyLogged = existingLogs.some((log) =>
    isSameDay(new Date(log.date), selectedDate),
  );

  const handleClose = () => {
    setIsDialogOpen(false);
    reset();
    setPreviews([]);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const updatedFiles = [...photos, ...files].slice(0, 3);

    setValue("photos", updatedFiles);

    // Генерируем URL для превью
    const newPreviews = updatedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removePhoto = (index: number) => {
    const updatedFiles = photos.filter((_, i) => i !== index);
    setValue("photos", updatedFiles);
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const onSubmit = (values: FormValues) => {
    if (isDateAlreadyLogged) return;

    const newTasks = values.items.map((i) => i.text);

    const updatedHistory = saveWorkLogTaskHistory(taskHistory, newTasks);
    setTaskHistory(updatedHistory);
    createLog(
      {
        objectId,
        date: values.date.toISOString(),
        items: values.items,
        photos: values.photos, // Передаем массив File[] в наш API (который сделает FormData)
      },
      {
        onSuccess: () => handleClose(),
      },
    );
  };

  useEffect(() => {
    setTaskHistory(loadWorkLogTaskHistory());
  }, []);

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => (!open ? handleClose() : setIsDialogOpen(true))}
    >
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" /> Новая запись
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить запись в журнал</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
          {/* Блок Даты */}
          <div className="space-y-2">
            <Label>Дата выполнения работ</Label>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
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
                      onSelect={(d) => {
                        field.onChange(d);
                        setIsCalendarOpen(false);
                      }}
                      disabled={(date) => date > new Date()}
                      locale={ru}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {isDateAlreadyLogged && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Запись на эту дату уже
                существует
              </p>
            )}
          </div>

          {/* Блок Работ */}
          <div className="space-y-3">
            <Label>Что было сделано</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  {...register(`items.${index}.text` as const)}
                  placeholder="Например: Прокладка кабеля 50м"
                  list={`task-suggestions-${index}`}
                  autoComplete="off"
                  className={cn(
                    errors.items?.[index]?.text && "border-destructive",
                  )}
                />

                <datalist id={`task-suggestions-${index}`}>
                  {taskHistory.map((task, idx) => (
                    <option key={idx} value={task} />
                  ))}
                </datalist>
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

          {/* Блок Фотографий */}
          <div className="space-y-3">
            <Label>Фотоотчет (до 3-х фото)</Label>
            <div className="flex flex-wrap gap-3">
              {previews.map((src, index) => (
                <div
                  key={src}
                  className="relative w-20 h-20 rounded-md overflow-hidden border bg-muted"
                >
                  <img
                    src={src}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5 hover:bg-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {previews.length < 3 && (
                <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed rounded-md cursor-pointer hover:bg-muted transition-colors">
                  <ImagePlus className="h-5 w-5 text-muted-foreground" />
                  <span className="text-[10px] mt-1 text-muted-foreground uppercase font-medium">
                    Фото
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={onFileChange}
                  />
                </label>
              )}
            </div>
            {errors.photos && (
              <p className="text-xs text-destructive">
                {errors.photos.message as string}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={isPending || isDateAlreadyLogged}
          >
            {isPending ? "Сохранение..." : "Сохранить в журнал"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
