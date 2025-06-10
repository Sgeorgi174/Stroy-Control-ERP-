import { ObjectSelectForForms } from "@/components/dashboard/select-object-for-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { objects } from "@/constants/objects";
import { useToolsSheetStore } from "@/stores/tool-sheet-store";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type FormData = {
  name: string;
  serialNumber: string;
  objectId: string | null;
};

export function ToolsAdd() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      serialNumber: "",
      objectId: objects[0].id,
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
        `Успешно создан инструмент Имя: ${data.name.trim()} Серийник: ${data.serialNumber.trim()} Объект: ${
          data.objectId
        }`
      );
    } catch (error) {
      toast.error("Не удалось создать инструмент");
      console.error("Ошибка:", error);
    }
  };

  return (
    <div className="p-5">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 w-[400px]">
          <Label htmlFor="name">Наименование *</Label>
          <Input
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
            id="serialNumber"
            type="text"
            {...register("serialNumber", { required: "Это поле обязательно" })}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
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
            Добавить
          </Button>
        </div>
      </form>
    </div>
  );
}
