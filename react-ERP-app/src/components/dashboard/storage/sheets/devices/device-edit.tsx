import { ObjectSelectForForms } from "@/components/dashboard/select-object-for-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Device } from "@/types/device";
import { useDeviceSheetStore } from "@/stores/device-sheet-store";
import { useUpdateDevice } from "@/hooks/device/useUpdateDevice";
import { useObjects } from "@/hooks/object/useObject";

const formSchema = z.object({
  name: z.string().min(1, "Наименование обязательно"),
  serialNumber: z.string().min(1, "Инвентарный номер обязателен"),
  objectId: z.string().min(1, "Место хранения обязательно"),
  originalSerial: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

type DeviceEditProps = {
  device: Device;
};

export function DeviceEdit({ device }: DeviceEditProps) {
  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: device.name,
      serialNumber: device.serialNumber,
      objectId: device.objectId || "",
      originalSerial: device.originalSerial ?? undefined,
    },
    resolver: zodResolver(formSchema),
  });

  const { closeSheet } = useDeviceSheetStore();

  const selectedObjectId = watch("objectId");

  const { mutate: updateDevice, isPending } = useUpdateDevice(device.id);

  const onSubmit = (data: FormData) => {
    updateDevice(
      {
        name: data.name.trim(),
        serialNumber: data.serialNumber.trim(),
        objectId: data.objectId,
        originalSerial: data.originalSerial,
      },
      {
        onSuccess: () => {
          reset();
          closeSheet();
        },
        onError: () => {
          toast.error("Не удалось обновить устройство");
        },
      }
    );
  };

  return (
    <div className="p-5">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 w-[400px]">
          <Label htmlFor="name">Наименование *</Label>
          <Input
            id="name"
            type="text"
            {...register("name")}
            disabled={isPending}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-[400px]">
          <Label htmlFor="serialNumber">Инвентарный № *</Label>
          <Input
            id="serialNumber"
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

        {/* Серийник */}
        <div className="flex flex-col gap-2 w-[400px]">
          <Label htmlFor="originalSerial">Серийный №</Label>
          <Input
            id="originalSerial"
            placeholder="Введите серийный номер"
            type="text"
            {...register("originalSerial")}
          />
          {errors.originalSerial && (
            <p className="text-sm text-red-500">
              {errors.originalSerial.message}
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
          <Button type="submit" className="w-[300px]" disabled={isPending}>
            {isPending ? "Сохраняем..." : "Сохранить"}
          </Button>
        </div>
      </form>
    </div>
  );
}
