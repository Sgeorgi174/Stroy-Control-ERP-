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
import { SelectPreffixForInventory } from "@/components/dashboard/select-preffix-inventory";
import { generateInventoryNumber } from "@/lib/utils/generateInventaryNumber";
import { useDevices } from "@/hooks/device/useDevices";
import type { Device } from "@/types/device";
import { useState } from "react";

// 1. Схема валидации Zod
const deviceSchema = z.object({
  name: z.string().min(1, "Это поле обязательно"),
  serialNumber: z.string().min(1, "Это поле обязательно"),
  objectId: z.string().min(1, "Выберите объект"),
  originalSerial: z.string().optional(),
});

type FormData = z.infer<typeof deviceSchema>;

export function DeviceAdd() {
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
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      name: "",
      serialNumber: "",
      objectId: objects[0]?.id ?? "",
      originalSerial: "",
    },
  });

  const { closeSheet } = useDeviceSheetStore();
  const selectedObjectId = watch("objectId");

  const { mutate: createDevice, isPending } = useCreateDevice();
  const [prefix, setPrefix] = useState<string | null>(null);
  const { data: devices = [] } = useDevices({
    searchQuery: "",
    objectId: "all",
    status: undefined,
    includeAllStatuses: "true",
  });
  const usedNumbers = devices
    .map((device: Device) => device.serialNumber)
    .filter(Boolean);

  const onSubmit = (data: FormData) => {
    const trimmedName = data.name.trim().replace(/\s+/g, " ");
    const trimmedSerial = data.serialNumber.trim();

    createDevice(
      {
        name: trimmedName,
        serialNumber: trimmedSerial,
        objectId: data.objectId,
        originalSerial: data.originalSerial,
      },
      {
        onSuccess: () => {
          reset();
          closeSheet();
        },
      }
    );
  };

  console.log(devices);

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

        {/* Инвентарник */}
        <div className="flex gap-2">
          <div className="flex flex-col gap-2 w-[200px]">
            <Label htmlFor="serialNumber">Инвентарный № *</Label>
            <Input
              id="serialNumber"
              placeholder="Инвентарный №"
              type="text"
              {...register("serialNumber")}
            />
            {errors.serialNumber && (
              <p className="text-sm text-red-500">
                {errors.serialNumber.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label>Генерация</Label>
            <SelectPreffixForInventory
              prefix={prefix ?? ""}
              setPrefix={setPrefix}
              isTool={false}
              className="w-[230px]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-transparent">Генерация</Label>
            <Button
              type="button"
              disabled={!prefix}
              onClick={() => {
                if (!prefix) return;
                const generated = generateInventoryNumber(prefix, usedNumbers);
                setValue("serialNumber", generated);
              }}
            >
              Сгенерировать
            </Button>
          </div>
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
          <Button type="submit" className="w-[300px]" disabled={isPending}>
            {isPending ? "Добавление..." : "Добавить"}
          </Button>
        </div>
      </form>
    </div>
  );
}
