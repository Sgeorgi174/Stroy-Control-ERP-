import { ObjectSelectForForms } from "@/components/dashboard/select-object-for-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { objects } from "@/constants/objects";
import { useToolsSheetStore } from "@/stores/tool-sheet-store";
import type { Tool } from "@/types/tool";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type ToolsEditProps = { tool: Tool };

type FormData = {
  name: string;
  serialNumber: string;
  objectId: string | null;
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
      objectId: tool.objectId,
    },
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
        `Успешно изменен инструмент Имя: ${data.name.trim()} Серийник: ${data.serialNumber.trim()} Объект: ${
          data.objectId
        }`
      );
    } catch (error) {
      toast.error("Не удалось редактировать инструмент");
      console.error("Ошибка:", error);
    }
  };

  return (
    <div className="p-5">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 w-[400px]">
          <Label htmlFor="name">Наименование *</Label>
          <Input
            autoFocus={false}
            id="name"
            type="text"
            {...register("name", { required: "Это поле обязательно" })}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-[400px]">
          <Label htmlFor="name">Серийный № *</Label>
          <Input
            autoFocus={false}
            id="serialNumber"
            type="text"
            {...register("serialNumber", { required: "Это поле обязательно" })}
          />
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
            onSelectChange={(id) => setValue("objectId", id)}
            objects={objects}
          />
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
