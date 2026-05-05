import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Pencil, CalendarIcon, ImagePlus, X, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";
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
import { Label } from "@/components/ui/label";
import { useUpdateMaterialDelivery } from "@/hooks/material-delivery/useMaterialDelivery";

const formSchema = z.object({
  date: z.date({ required_error: "Выберите дату" }),
});

interface Photo {
  id: string;
  url: string;
}

export function EditWorkLogDeliveriesDialog({
  objectId,
  delivery,
}: {
  objectId: string;
  delivery: any;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Разделяем стейты для фото: старые (из базы) и новые (файлы)
  const [existingPhotos, setExistingPhotos] = useState<Photo[]>([]);
  const [newFiles, setNewFiles] = useState<{ file: File; preview: string }[]>(
    [],
  );

  const { mutateAsync: updateDelivery, isPending } =
    useUpdateMaterialDelivery(objectId);

  const { control, handleSubmit, setValue } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { date: new Date() },
  });

  // Заполняем форму при открытии
  useEffect(() => {
    if (isOpen && delivery) {
      setValue("date", parseISO(delivery.date));
      setExistingPhotos(delivery.photos || []);
      setNewFiles([]);
    }
  }, [isOpen, delivery, setValue]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalCount = existingPhotos.length + newFiles.length + files.length;

    if (totalCount > 10) return; // Или вывести тост

    const added = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setNewFiles((prev) => [...prev, ...added]);
  };

  const removeExisting = (id: string) => {
    setExistingPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const removeNew = (index: number) => {
    URL.revokeObjectURL(newFiles[index].preview);
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: any) => {
    try {
      await updateDelivery({
        id: delivery.id,
        data: {
          date: values.date.toISOString(),
          // ИЗМЕНЕНО: Передаем URL, а не ID
          existingPhotos: existingPhotos.map((p) => p.url),
          photos: newFiles.map((f) => f.file),
        },
      });
      setIsOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Редактировать накладную</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label>Дата</Label>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value
                        ? format(field.value, "PPP", { locale: ru })
                        : "Дата"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      locale={ru}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>

          <div className="space-y-3">
            <Label>
              Фотографии ({existingPhotos.length + newFiles.length}/10)
            </Label>
            <div className="grid grid-cols-4 gap-3">
              {/* Старые фото */}
              {existingPhotos.map((p) => (
                <div
                  key={p.id}
                  className="relative aspect-square border rounded-md overflow-hidden"
                >
                  <img
                    src={p.url}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <button
                    type="button"
                    onClick={() => removeExisting(p.id)}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {/* Новые фото */}
              {newFiles.map((f, i) => (
                <div
                  key={i}
                  className="relative aspect-square border rounded-md border-primary overflow-hidden"
                >
                  <img src={f.preview} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNew(i)}
                    className="absolute top-1 right-1 bg-destructive text-white rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {existingPhotos.length + newFiles.length < 10 && (
                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-md cursor-pointer hover:bg-muted">
                  <ImagePlus className="h-6 w-6 text-muted-foreground" />
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

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            ) : (
              "Сохранить изменения"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
