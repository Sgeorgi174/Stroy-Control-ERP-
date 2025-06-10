import { ObjectSelectForForms } from "@/components/dashboard/select-object-for-form";
import { SeasonSelectForForms } from "@/components/dashboard/select-season-for-form";
import { SizeSelectForForms } from "@/components/dashboard/select-size-for-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { objects } from "@/constants/objects";
import { useClothesSheetStore } from "@/stores/clothes-sheet-store";
import { useFilterPanelStore } from "@/stores/filter-panel-store";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type FormData = {
  name: string;
  size: number | null;
  objectId: string | null;
  price: number | null;
  quantity: number | null;
  type: "CLOTHING" | "FOOTWEAR" | null;
  season: string | null;
};

export function ClothesAdd() {
  const { activeTab } = useFilterPanelStore();

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
      size: null,
      objectId: objects[0].id,
      price: null,
      quantity: null,
      type: activeTab === "clothing" ? "CLOTHING" : "FOOTWEAR",
      season: "SUMMER",
    },
  });

  const { closeSheet } = useClothesSheetStore();

  const selectedObjectId = watch("objectId");
  const selectedSeason = watch("season");
  const selectedSize = watch("size");

  const onSubmit = (data: FormData) => {
    try {
      console.log("Собранные данные:", {
        name: data.name.trim(),
        objectId: data.objectId,
        type: data.type,
      });
      reset();
      closeSheet();
      toast.success(
        `Успешно создана одежда Имя: ${data.name.trim()} Объект: ${
          data.objectId
        } Тип: ${data.type}`
      );
    } catch (error) {
      toast.error("Не удалось создать инструмент");
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
              {...register("quantity", { required: "Это поле обязательно" })}
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
              {...register("price", { required: "Это поле обязательно" })}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>
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
