import { HeightSelectForForms } from "@/components/dashboard/select-height-for-form";
import { ObjectSelectForForms } from "@/components/dashboard/select-object-for-form";
import { ProviderSelectForForms } from "@/components/dashboard/select-provider-for-form";
import { SeasonSelectForForms } from "@/components/dashboard/select-season-for-form";
import { SizeSelectForForms } from "@/components/dashboard/select-size-for-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateClothes } from "@/hooks/clothes/useClothes";
import { useObjects } from "@/hooks/object/useObject";
import { useClothesSheetStore } from "@/stores/clothes-sheet-store";
import { useFilterPanelStore } from "@/stores/filter-panel-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const baseSchema = z.object({
  name: z.string().min(1, "Это поле обязательно"),
  clothingSizeId: z.string().optional(),
  footwearSizeId: z.string().optional(),
  clothingHeightId: z.string().optional(),
  providerId: z.string().min(1, "Выберите поставщика"),
  objectId: z.string().min(1, "Выберите объект"),
  price: z
    .number({ invalid_type_error: "Укажите цену" })
    .min(1, { message: "Цена должна быть больше 0" }),
  quantity: z
    .number({ invalid_type_error: "Введите количество" })
    .min(1, { message: "Количество должно быть больше 0" }),
  type: z.enum(["CLOTHING", "FOOTWEAR"], { message: "Выберите тип одежды" }),
  season: z.enum(["WINTER", "SUMMER"], { message: "Выберите сезон" }),
  partNumber: z.string().min(1, "Это поле обязательно"),
});

const clothesSchema = baseSchema
  .refine(
    (data) =>
      (data.type === "CLOTHING" && !!data.clothingSizeId) ||
      (data.type === "FOOTWEAR" && !!data.footwearSizeId),
    {
      message: "Выберите корректный размер",
      path: ["clothingSizeId"], // куда поместить ошибку
    },
  )
  .refine((data) => data.type === "FOOTWEAR" || !!data.clothingHeightId, {
    message: "Выберите ростовку",
    path: ["clothingHeightId"],
  });

type FormData = z.infer<typeof clothesSchema>;

export function ClothesCreate() {
  const { activeTab } = useFilterPanelStore();
  const createClothesMutation = useCreateClothes();
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
    resolver: zodResolver(clothesSchema),
    defaultValues: {
      name: "",
      providerId: "",
      clothingSizeId: "",
      footwearSizeId: "",
      clothingHeightId: "",
      objectId: "",
      price: undefined,
      quantity: undefined,
      type: activeTab === "clothing" ? "CLOTHING" : "FOOTWEAR",
      season: "SUMMER",
      partNumber: "",
    },
  });

  const { closeSheet } = useClothesSheetStore();

  const selectedObjectId = watch("objectId");
  const selectedSeason = watch("season");
  const selectedClosthingSize = watch("clothingSizeId");
  const selectedFootwearSize = watch("footwearSizeId");
  const selectedClothingHeight = watch("clothingHeightId");
  const selectedProvider = watch("providerId");

  const onSubmit = async (data: FormData) => {
    try {
      await createClothesMutation.mutateAsync({
        name: data.name.trim().replace(/\s+/g, " "),
        objectId: data.objectId,
        clothingHeightId:
          activeTab === "clothing" ? data.clothingHeightId : undefined,
        clothingSizeId:
          activeTab === "clothing" ? data.clothingSizeId : undefined,
        footwearSizeId:
          activeTab === "footwear" ? data.footwearSizeId : undefined,
        providerId: data.providerId,

        price: data.price,
        quantity: data.quantity,
        type: data.type,
        season: data.season,
        partNumber: data.partNumber,
      });
      reset();
      closeSheet();
    } catch (error) {
      console.error("Ошибка при создании одежды:", error);
    }
  };

  return (
    <div className="p-5">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Наименование</Label>
            <Input
              className="w-[300px]"
              placeholder="Введите наименование"
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
              className="w-[300px]"
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
              className="w-[300px]"
              type="number"
              {...register("quantity", {
                required: "Это поле обязательно",
                valueAsNumber: true,
              })}
            />
            {errors.quantity && (
              <p className="text-sm text-red-500">{errors.quantity.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Поставщик</Label>
            <ProviderSelectForForms
              className="w-[300px]"
              selectedProvider={selectedProvider}
              onSelectChange={(provider) => setValue("providerId", provider)}
            />
            {errors.providerId && (
              <p className="text-sm text-red-500">
                {errors.providerId.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          {activeTab === "clothing" ? (
            <div className="flex flex-col gap-2">
              <Label>Размер одежды</Label>
              <SizeSelectForForms
                className="w-[300px]"
                type={"CLOTHING"}
                selectedSize={selectedClosthingSize}
                onSelectChange={(size) => setValue("clothingSizeId", size)}
              />
              {errors.clothingSizeId && (
                <p className="text-sm text-red-500">
                  {errors.clothingSizeId.message}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Label>Размер Обуви</Label>
              <SizeSelectForForms
                className="w-[300px]"
                type={"FOOTWEAR"}
                selectedSize={selectedFootwearSize}
                onSelectChange={(size) => setValue("footwearSizeId", size)}
              />
            </div>
          )}

          {activeTab !== "footwear" && (
            <div className="flex flex-col gap-2">
              <Label>Ростовка</Label>
              <HeightSelectForForms
                className="w-[300px]"
                selectedHeight={selectedClothingHeight}
                onSelectChange={(height) =>
                  setValue("clothingHeightId", height)
                }
              />
              {errors.clothingHeightId && (
                <p className="text-sm text-red-500">
                  {errors.clothingHeightId.message}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <Label>Место хранения</Label>
            <ObjectSelectForForms
              className="w-[300px]"
              objects={objects}
              selectedObjectId={selectedObjectId}
              onSelectChange={(id) => {
                if (id !== null) {
                  setValue("objectId", id);
                }
              }}
            />
            {errors.objectId && (
              <p className="text-sm text-red-500">{errors.objectId.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="price">Цена</Label>
            <Input
              className="w-[300px]"
              id="price"
              type="number"
              {...register("price", {
                required: "Это поле обязательно",
                valueAsNumber: true,
              })}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="partNumber">Артикул</Label>
          <Input
            className="w-[300px]"
            placeholder="Введите артикул"
            id="partNumber"
            type="text"
            {...register("partNumber")}
          />
          {errors.partNumber && (
            <p className="text-sm text-red-500">{errors.partNumber.message}</p>
          )}
        </div>

        <div className="flex justify-center mt-10">
          <Button
            type="submit"
            className="w-[300px]"
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
