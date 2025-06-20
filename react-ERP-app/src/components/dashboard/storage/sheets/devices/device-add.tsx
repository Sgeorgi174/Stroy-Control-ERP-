import { ObjectSelectForForms } from "@/components/dashboard/select-object-for-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDeviceSheetStore } from "@/stores/device-sheet-store";
import { useCreateDevice } from "@/hooks/device/useCreateDevice";
import { useObjects } from "@/hooks/object/useObject";

// 1. Схема валидации Zod
const deviceSchema = z.object({
  name: z.string().min(1, "Это поле обязательно"),
  serialNumber: z.string().min(1, "Это поле обязательно"),
  objectId: z.string().min(1, "Выберите объект"),
});

type FormData = z.infer<typeof deviceSchema>;

export function DeviceAdd() {
  const { data: objects = [] } = useObjects();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      name: "",
      serialNumber: "",
      objectId: objects[0]?.id ?? "",
    },
  });

  const { closeSheet } = useDeviceSheetStore();
  const selectedObjectId = watch("objectId");

  const { mutate: createDevice, isPending } = useCreateDevice();

  const onSubmit = (data: FormData) => {
    const trimmedName = data.name.trim();
    const trimmedSerial = data.serialNumber.trim();

    createDevice(
      {
        name: trimmedName,
        serialNumber: trimmedSerial,
        objectId: data.objectId,
      },
      {
        onSuccess: () => {
          reset();
          closeSheet();
        },
      }
    );
  };

  return (
    <div className="p-5">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Имя */}
        <div className="flex flex-col gap-2 w-[400px]">
          <Label htmlFor="name">Наименование *</Label>
          <Input
            id="name"
            placeholder="Введите наименование"
            type="text"
            {...register("name")}
            disabled={isPending}
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
            disabled={isPending}
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
            disabled={isPending}
          />
          {errors.objectId && (
            <p className="text-sm text-red-500">{errors.objectId.message}</p>
          )}
        </div>

        {/* Кнопка */}
        <div className="flex justify-center mt-10">
          <Button type="submit" className="w-[200px]" disabled={isPending}>
            {isPending ? "Добавление..." : "Добавить"}
          </Button>
        </div>
      </form>
    </div>
  );
}
