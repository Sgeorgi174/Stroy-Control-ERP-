import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { ObjectSelectForForms } from "@/components/dashboard/select-object-for-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { objects } from "@/constants/objects&Users";
import { useToolsSheetStore } from "@/stores/tool-sheet-store";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

// 1. Схема валидации Zod
const toolSchema = z.object({
  name: z.string().min(1, "Это поле обязательно"),
  serialNumber: z.string().min(1, "Это поле обязательно"),
  objectId: z.string().min(1, "Выберите объект"),
});

type FormData = z.infer<typeof toolSchema>;

export function ToolsAdd() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      name: "",
      serialNumber: "",
      objectId: objects[0]?.id ?? "",
    },
  });

  const { closeSheet } = useToolsSheetStore();
  const selectedObjectId = watch("objectId");

  const onSubmit = (data: FormData) => {
    try {
      const trimmedName = data.name.trim();
      const trimmedSerial = data.serialNumber.trim();

      console.log("Собранные данные:", {
        name: trimmedName,
        serialNumber: trimmedSerial,
        objectId: data.objectId,
      });

      reset();
      closeSheet();
      toast.success(
        `Успешно создан инструмент\nИмя: ${trimmedName}\nСерийник: ${trimmedSerial}\nОбъект: ${data.objectId}`
      );
    } catch (error) {
      toast.error("Не удалось создать инструмент");
      console.error("Ошибка:", error);
    }
  };

  return (
    <div className="p-5">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Имя */}
        <div className="flex flex-col gap-2 w-[400px]">
          <Label htmlFor="name">Наименование *</Label>
          <Input
            id="name"
            type="text"
            placeholder="Введите наименование"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Серийник */}
        <div className="flex flex-col gap-2 w-[400px]">
          <Label htmlFor="serialNumber">Серийный № *</Label>
          <Input
            id="serialNumber"
            placeholder="Введите серийный номер"
            type="text"
            {...register("serialNumber")}
          />
          {errors.serialNumber && (
            <p className="text-sm text-red-500">
              {errors.serialNumber.message}
            </p>
          )}
        </div>

        {/* Объект */}
        <div className="flex flex-col gap-2">
          <Label>Место хранения *</Label>
          <ObjectSelectForForms
            selectedObjectId={selectedObjectId}
            onSelectChange={(id) => {
              if (id) setValue("objectId", id);
            }}
            objects={objects}
          />
          {errors.objectId && (
            <p className="text-sm text-red-500">{errors.objectId.message}</p>
          )}
        </div>

        {/* Кнопка */}
        <div className="flex justify-center mt-10">
          <Button type="submit" className="w-[200px]">
            Добавить
          </Button>
        </div>
      </form>
    </div>
  );
}
