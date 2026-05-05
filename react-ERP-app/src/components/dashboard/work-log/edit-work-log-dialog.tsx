import { useEffect, useState } from "react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Pencil, Plus, Trash2, CalendarIcon, ImagePlus, X } from "lucide-react";
import { format } from "date-fns";
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
import { useUpdateWorkLog } from "@/hooks/work-log/useWorkLog";
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
  // Здесь храним только НОВЫЕ файлы
  newPhotos: z.array(z.any()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function EditWorkLogDialog({
  objectId,
  log,
}: {
  objectId: string;
  log: WorkLog;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [taskHistory, setTaskHistory] = useState<string[]>([]);

  // Состояние для существующих фото (URL)
  const [existingPhotos, setExistingPhotos] = useState<string[]>(
    log.photos.map((p) => p.url),
  );
  // Состояние для превью новых файлов
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const { mutate: updateLog, isPending } = useUpdateWorkLog(objectId);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(log.date),
      items: log.items.map((i) => ({ text: i.text })),
      newPhotos: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const newPhotos = watch("newPhotos") || [];

  const handleClose = () => {
    setIsDialogOpen(false);
    reset();
    setNewPreviews([]);
    setExistingPhotos(log.photos.map((p) => p.url));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalCurrentCount = existingPhotos.length + newPhotos.length;

    // Лимит 3 фото суммарно
    const allowedToAdd = 3 - totalCurrentCount;
    if (allowedToAdd <= 0) return;

    const filesToUpload = files.slice(0, allowedToAdd);
    const updatedFiles = [...newPhotos, ...filesToUpload];

    setValue("newPhotos", updatedFiles);
    setNewPreviews(updatedFiles.map((f) => URL.createObjectURL(f)));
  };

  const removeExistingPhoto = (url: string) => {
    setExistingPhotos((prev) => prev.filter((p) => p !== url));
  };

  const removeNewPhoto = (index: number) => {
    const updatedFiles = newPhotos.filter((_, i) => i !== index);
    setValue("newPhotos", updatedFiles);
    setNewPreviews(newPreviews.filter((_, i) => i !== index));
  };

  const onSubmit = (values: FormValues) => {
    const newTasks = values.items.map((i) => i.text);
    saveWorkLogTaskHistory(taskHistory, newTasks);

    updateLog(
      {
        id: log.id,
        data: {
          objectId,
          date: values.date.toISOString(),
          items: values.items,
          existingPhotos: existingPhotos, // Какие фото из старых оставить
          photos: values.newPhotos, // Какие новые добавить
        },
      },
      {
        onSuccess: () => setIsDialogOpen(false),
      },
    );
  };

  useEffect(() => {
    setTaskHistory(loadWorkLogTaskHistory());
  }, []);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактировать запись</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
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
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(field.value, "PPP", { locale: ru })}
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
          </div>

          <div className="space-y-3">
            <Label>Что было сделано</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  {...register(`items.${index}.text` as const)}
                  placeholder="Описание работ..."
                  list={`task-suggestions-edit-${index}`}
                  autoComplete="off"
                />
                <datalist id={`task-suggestions-edit-${index}`}>
                  {taskHistory.map((task, idx) => (
                    <option key={idx} value={task} />
                  ))}
                </datalist>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="text-destructive shrink-0"
                  disabled={fields.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
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

          <div className="space-y-3">
            <Label>Фотоотчет (до 3-х фото)</Label>
            <div className="flex flex-wrap gap-3">
              {/* Рендерим старые фото */}
              {existingPhotos.map((url) => (
                <div
                  key={url}
                  className="relative w-20 h-20 rounded-md overflow-hidden border bg-muted group"
                >
                  <img
                    src={url}
                    alt="existing"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingPhoto(url)}
                    className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5 hover:bg-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {/* Рендерим превью новых фото */}
              {newPreviews.map((src, index) => (
                <div
                  key={src}
                  className="relative w-20 h-20 rounded-md overflow-hidden border border-primary/50 bg-muted"
                >
                  <img
                    src={src}
                    alt="new preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewPhoto(index)}
                    className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5 hover:bg-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-primary text-[8px] text-white text-center uppercase py-0.5">
                    New
                  </div>
                </div>
              ))}

              {existingPhotos.length + newPhotos.length < 3 && (
                <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed rounded-md cursor-pointer hover:bg-muted transition-colors">
                  <ImagePlus className="h-5 w-5 text-muted-foreground" />
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
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
            >
              Отмена
            </Button>
            <Button type="submit" className="flex-[2]" disabled={isPending}>
              {isPending ? "Сохранение..." : "Обновить запись"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
