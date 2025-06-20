import { ObjectSelectForForms } from "@/components/dashboard/select-object-for-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { objects } from "@/constants/objects&Users";
import { useToolsSheetStore } from "@/stores/tool-sheet-store";
import type { Tool } from "@/types/tool";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Схема валидации
const formSchema = z.object({
  name: z.string().min(1, "Наименование обязательно"),
  serialNumber: z.string().min(1, "Серийный номер обязателен"),
  objectId: z.string().min(1, "Место хранения обязательно"),
});

type FormData = z.infer<typeof formSchema>;

type ToolsEditProps = {
  tool: Tool;
};

export function ToolsEdit({ tool }: ToolsEditProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: tool.name,
      serialNumber: tool.serialNumber,
      objectId: tool.objectId || objects[0].id,
    },
    resolver: zodResolver(formSchema),
  });

  const { closeSheet } = useToolsSheetStore();
  const selectedObjectId = watch("objectId");

  const onSubmit = (data: FormData) => {
    try {
      console.log("Собранные данные:", {
        name: data.name.trim(),
        serialNumber: data.serialNumber.trim(),
        objectId: data.objectId,
      });

      reset();
      closeSheet();

      toast.success(
        `Инструмент обновлён: ${data.name.trim()} (Серийник: ${data.serialNumber.trim()})`
      );
    } catch (error) {
      console.error("Ошибка редактирования:", error);
      toast.error("Не удалось отредактировать инструмент");
    }
  };

  return (
    <div className="p-5">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 w-[400px]">
          <Label htmlFor="name">Наименование *</Label>
          <Input id="name" type="text" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-[400px]">
          <Label htmlFor="serialNumber">Серийный № *</Label>
          <Input id="serialNumber" type="text" {...register("serialNumber")} />
          {errors.serialNumber && (
            <p className="text-sm text-red-500">
              {errors.serialNumber.message}
            </p>
          )}
        </div>

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

        <div className="flex justify-center mt-10">
          <Button type="submit" className="w-[200px]">
            Сохранить
          </Button>
        </div>
      </form>
    </div>
  );
}
