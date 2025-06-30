import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useObjectSheetStore } from "@/stores/objects-sheet-store";
import { ForemanAutocomplete } from "../../select-foreman-for-form";
import type { Object } from "@/types/object";
import { useEffect, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { splitAddress } from "@/lib/utils/splitAddress";
import { useUpdateObject } from "@/hooks/object/useUpdateObject";
import { useGetFreeForemen } from "@/hooks/user/useGetFreeForemen";

// 1. Схема валидации Zod
const tabletSchema = z
  .object({
    name: z.string().min(1, "Это поле обязательно"),
    city: z.string().min(1, "Это поле обязательно"),
    street: z.string().min(1, "Это поле обязательно"),
    buildings: z.string().min(1, "Это поле обязательно"),
    userId: z.string().nullable(), // Может быть null
    noForeman: z.boolean(), // Чекбокс
  })
  .refine(
    (data) => data.noForeman || (!!data.userId && data.userId.trim() !== ""),
    {
      message: "Выберите бригадира",
      path: ["userId"],
    }
  );

type FormData = z.infer<typeof tabletSchema>;

type ObjectEditProps = {
  object: Object;
};

export function ObjectEdit({ object }: ObjectEditProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(tabletSchema),
    defaultValues: {
      name: object.name,
      city: splitAddress(object).city,
      street: splitAddress(object).street,
      buildings: splitAddress(object).buldings,
      userId: object.foreman ? object.foreman.id : null,
      noForeman: false,
    },
  });

  const { closeSheet } = useObjectSheetStore();
  const selectedUserId = watch("userId");
  const noForeman = watch("noForeman");
  const { data: foremen = [] } = useGetFreeForemen();

  const combinedForemen = useMemo(() => {
    return object.foreman ? [object.foreman, ...foremen] : foremen;
  }, [object.foreman, foremen]);

  const { mutate: updateObject, isPending } = useUpdateObject(object.id);

  useEffect(() => {
    if (noForeman) {
      setValue("userId", "", { shouldValidate: true });
      clearErrors("userId");
    }
  }, [noForeman]);

  const onSubmit = (data: FormData) => {
    const trimmedName = data.name.trim();
    const trimmedAddress = `${data.city.trim()}, ${data.street.trim()}, ${data.buildings.trim()}`;

    updateObject(
      {
        name: trimmedName,
        address: trimmedAddress,
        userId: data.noForeman ? null : data.userId,
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
            type="text"
            placeholder="Введите наименование"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Адрес */}
        <div className="flex gap-6">
          <div className="flex flex-col gap-2 w-[200px]">
            <Label htmlFor="serialNumber">Город*</Label>
            <Input
              id="city"
              placeholder="Город"
              type="text"
              {...register("city")}
            />
            {errors.city && (
              <p className="text-sm text-red-500">{errors.city.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 w-[200px]">
            <Label htmlFor="serialNumber">Улица*</Label>
            <Input
              id="street"
              placeholder="Улица"
              type="text"
              {...register("street")}
            />
            {errors.street && (
              <p className="text-sm text-red-500">{errors.street.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 w-[180px]">
            <Label htmlFor="serialNumber">Строение/Корпус/Дом*</Label>
            <Input
              id="buildings"
              placeholder="Номер строения"
              type="text"
              {...register("buildings")}
            />
            {errors.buildings && (
              <p className="text-sm text-red-500">{errors.buildings.message}</p>
            )}
          </div>
        </div>

        {/* Сотрудник */}
        <div className="flex flex-col gap-2 mt-10">
          <Label>Бригадир *</Label>
          <div className="flex items-center gap-8">
            <ForemanAutocomplete
              disabled={noForeman}
              foremen={combinedForemen}
              onSelectChange={(userId) =>
                setValue("userId", userId, { shouldValidate: true })
              }
              selectedUserId={selectedUserId}
            />

            <div className="flex items-center gap-3">
              <Checkbox
                id="noForeman"
                checked={noForeman}
                {...register("noForeman")}
                onCheckedChange={(checked) => {
                  const isChecked = !!checked;
                  setValue("noForeman", isChecked, { shouldValidate: true });

                  if (isChecked) {
                    setValue("userId", null, { shouldValidate: true });
                    clearErrors("userId");
                  }
                }}
              />
              <Label htmlFor="noForeman">Не назначать бригадира</Label>
            </div>
          </div>
          {errors.userId && (
            <p className="text-sm text-red-500">{errors.userId.message}</p>
          )}
        </div>

        {/* Кнопка */}
        <div className="flex justify-center mt-10">
          <Button type="submit" className="w-[300px]" disabled={isPending}>
            {isPending ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>
      </form>
    </div>
  );
}
