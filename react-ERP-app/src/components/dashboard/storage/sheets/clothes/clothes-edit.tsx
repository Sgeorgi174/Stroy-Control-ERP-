import { ObjectSelectForForms } from "@/components/dashboard/select-object-for-form";
import { SeasonSelectForForms } from "@/components/dashboard/select-season-for-form";
import { SizeSelectForForms } from "@/components/dashboard/select-size-for-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { objects } from "@/constants/objects&Users";
import { useClothesSheetStore } from "@/stores/clothes-sheet-store";
import { useFilterPanelStore } from "@/stores/filter-panel-store";
import type { Clothes } from "@/types/clothes";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Схема валидации
const clothesSchema = z.object({
  name: z.string().min(1, "Это поле обязательно"),
  size: z.number().min(30).max(60, "Размер вне диапазона"),
  objectId: z.string().min(1, "Это поле обязательно"),
  price: z.number().min(0, "Цена не может быть отрицательной"),
  quantity: z.number().int().min(1, "Количество должно быть минимум 1"),
  type: z.enum(["CLOTHING", "FOOTWEAR"]),
  season: z.enum(["SUMMER", "WINTER"]),
});

type FormData = z.infer<typeof clothesSchema>;

type ClothesEditProps = { clothes: Clothes };

export function ClothesEdit({ clothes }: ClothesEditProps) {
  const { activeTab } = useFilterPanelStore();
  const { closeSheet } = useClothesSheetStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(clothesSchema),
    mode: "onChange",
    defaultValues: {
      name: clothes.name,
      size: clothes.size ?? (activeTab === "clothing" ? 44 : 38),
      objectId: clothes.objectId ?? objects[0].id,
      price: clothes.price ?? 0,
      quantity: clothes.quantity ?? 1,
      type:
        clothes.type ?? (activeTab === "clothing" ? "CLOTHING" : "FOOTWEAR"),
      season: clothes.season ?? "SUMMER",
    },
  });

  const selectedObjectId = watch("objectId");
  const selectedSeason = watch("season");
  const selectedSize = watch("size");

  const onSubmit = (data: FormData) => {
    try {
      console.log("Собранные данные:", data);
      reset(data);
      closeSheet();
      toast.success(
        `Успешно изменена одежда Имя: ${data.name} Объект: ${data.objectId} Тип: ${data.type}`
      );
    } catch (error) {
      toast.error("Не удалось изменить комплект одежды");
      console.error("Ошибка:", error);
    }
  };

  return (
    <div className="p-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 m-auto w-[600px]"
      >
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Наименование</Label>
            <Input
              className="w-[300px]"
              id="name"
              type="text"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Сезон</Label>
            <SeasonSelectForForms
              selectedSeason={selectedSeason}
              onSelectChange={(season) => setValue("season", season)}
            />
            {errors.season && (
              <p className="text-sm text-red-500">{errors.season.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <Label htmlFor="quantity">Количество</Label>
            <Input
              id="quantity"
              type="number"
              {...register("quantity", { valueAsNumber: true })}
            />
            {errors.quantity && (
              <p className="text-sm text-red-500">{errors.quantity.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Размер</Label>
            <SizeSelectForForms
              selectedSize={selectedSize}
              onSelectChange={(size) => setValue("size", size)}
            />
            {errors.size && (
              <p className="text-sm text-red-500">{errors.size.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <Label>Место хранения</Label>
            <ObjectSelectForForms
              objects={objects}
              selectedObjectId={selectedObjectId}
              onSelectChange={(objectId) => setValue("objectId", objectId)}
            />
            {errors.objectId && (
              <p className="text-sm text-red-500">{errors.objectId.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="price">Цена</Label>
            <Input
              id="price"
              type="number"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <Button type="submit" className="w-[200px]" disabled={!isValid}>
            Сохранить
          </Button>
        </div>
      </form>
    </div>
  );
}
