import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Plus,
  CalendarIcon,
  AlertTriangle,
  ImagePlus,
  X,
  Loader2,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useCreateMaterialDelivery } from "@/hooks/material-delivery/useMaterialDelivery";

const formSchema = z.object({
  date: z.date({ required_error: "Выберите дату" }),
  photos: z
    .array(z.instanceof(File))
    .max(10, "Максимум 10 фотографий")
    .min(1, "Добавьте хотя бы одно фото"),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateWorkLogDeliveriesDialog({
  objectId,
  existingLogs,
}: {
  objectId: string;
  existingLogs: { date: string }[];
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  const { mutateAsync: createDelivery, isPending } =
    useCreateMaterialDelivery(objectId);

  const {
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
      photos: [],
    },
  });

  const selectedDate = watch("date");
  const photos = watch("photos") || [];

  const isDateAlreadyLogged = existingLogs.some((log) =>
    isSameDay(new Date(log.date), selectedDate),
  );

  const handleClose = () => {
    setIsDialogOpen(false);
    reset();
    previews.forEach((url) => URL.revokeObjectURL(url)); // Чистим память
    setPreviews([]);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const updatedFiles = [...photos, ...files].slice(0, 10);

    setValue("photos", updatedFiles, { shouldValidate: true });

    // Генерируем превью
    const newPreviews = updatedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removePhoto = (index: number) => {
    const updatedFiles = photos.filter((_, i) => i !== index);
    setValue("photos", updatedFiles, { shouldValidate: true });

    URL.revokeObjectURL(previews[index]);
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: FormValues) => {
    if (isDateAlreadyLogged) return;

    try {
      await createDelivery({
        date: values.date.toISOString(),
        objectId,
        photos: values.photos,
      });
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => (!open ? handleClose() : setIsDialogOpen(true))}
    >
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto bg-primary">
          <Plus className="h-4 w-4 mr-2" /> Новая запись
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Приход материалов</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
          <div className="space-y-2">
            <Label>Дата накладной</Label>
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
                <AlertTriangle className="h-3 w-3" /> На эту дату накладная уже
                внесена
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label>
              Фотографии накладных и материалов ({photos.length}/10)
            </Label>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {previews.map((src, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-md overflow-hidden border shadow-sm"
                >
                  <img src={src} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 bg-destructive text-white rounded-full p-0.5 hover:scale-110 transition-transform"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {previews.length < 10 && (
                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-md cursor-pointer hover:bg-muted hover:border-primary transition-all">
                  <ImagePlus className="h-6 w-6 text-muted-foreground" />
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={onFileChange}
                    disabled={isPending}
                  />
                </label>
              )}
            </div>
            {errors.photos && (
              <p className="text-xs text-destructive">
                {errors.photos.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={isPending || isDateAlreadyLogged}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Сохранение...
              </>
            ) : (
              "Загрузить накладные"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
