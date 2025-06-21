import { ObjectSelectForForms } from "@/components/dashboard/select-object-for-form";
import { SeasonSelectForForms } from "@/components/dashboard/select-season-for-form";
import { SizeSelectForForms } from "@/components/dashboard/select-size-for-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateClothes } from "@/hooks/clothes/useClothes";
import { useObjects } from "@/hooks/object/useObject";
import { useClothesSheetStore } from "@/stores/clothes-sheet-store";
import { useFilterPanelStore } from "@/stores/filter-panel-store";
import type { Season } from "@/types/season";
import { useForm } from "react-hook-form";

type FormData = {
  name: string;
  size: number;
  objectId: string;
  price: number;
  quantity: number;
  type: "CLOTHING" | "FOOTWEAR";
  season: Season;
};

export function ClothesCreate() {
  const { activeTab } = useFilterPanelStore();
  const createClothesMutation = useCreateClothes();
  const { data: objects = [] } = useObjects();

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
      size: activeTab === "clothing" ? 44 : 38,
      objectId: objects[0].id,
      price: 0,
      quantity: 1,
      type: activeTab === "clothing" ? "CLOTHING" : "FOOTWEAR",
      season: "SUMMER",
    },
  });

  const { closeSheet } = useClothesSheetStore();

  const selectedObjectId = watch("objectId");
  const selectedSeason = watch("season");
  const selectedSize = watch("size");

  const onSubmit = async (data: FormData) => {
    try {
      await createClothesMutation.mutateAsync({
        name: data.name.trim(),
        objectId: data.objectId,
        size: data.size,
        price: data.price,
        quantity: data.quantity,
        type: data.type,
        season: data.season,
      });

      reset();
      closeSheet();
    } catch (error) {
      console.error("Ошибка при создании одежды:", error);
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
              placeholder="Введите наименование"
              id="name"
              type="text"
              {...register("name", { required: "Это поле обязательно" })}
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
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <Label htmlFor="quantity">Количество</Label>
            <Input
              id="quantity"
              type="number"
              {...register("quantity", {
                required: "Это поле обязательно",
                valueAsNumber: true,
                min: { value: 1, message: "Количество должно быть больше 0" },
              })}
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
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="price">Цена</Label>
            <Input
              id="price"
              type="number"
              {...register("price", {
                required: "Это поле обязательно",
                valueAsNumber: true,
                min: { value: 0, message: "Цена не может быть отрицательной" },
              })}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <Button
            type="submit"
            className="w-full"
            disabled={createClothesMutation.isPending}
          >
            {createClothesMutation.isPending
              ? "Добавление..."
              : "Добавить одежду"}
          </Button>
        </div>
      </form>
    </div>
  );
}
