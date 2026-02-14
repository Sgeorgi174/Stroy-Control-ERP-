import { HeightSelectForForms } from "@/components/dashboard/select-height-for-form";
import { SizeSelectForForms } from "@/components/dashboard/select-size-for-form";
import { SeasonSelectForForms } from "@/components/dashboard/select-season-for-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { CreateClothesRequestDto } from "@/types/dto/clothes-request.dto";
import type { ClothesType } from "@/types/clothes";
import type { Season } from "@/types/season";

type Props = {
  form: CreateClothesRequestDto;
  setForm: React.Dispatch<React.SetStateAction<CreateClothesRequestDto>>;
};

export function Step3Clothes({ form, setForm }: Props) {
  const clothesList = form.clothes || [];

  const addClothes = () => {
    setForm({
      ...form,
      clothes: [
        ...clothesList,
        {
          type: "CLOTHING",
          season: "SUMMER",
          name: "",
          quantity: 1,
        },
      ],
    });
  };

  const update = (index: number, field: string, value: any) => {
    const updated = [...clothesList];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, clothes: updated });
  };

  const changeType = (index: number, value: ClothesType) => {
    const updated = [...clothesList];

    updated[index] = {
      ...updated[index],
      type: value,
      clothingSizeId: undefined,
      clothingHeightId: undefined,
      footwearSizeId: undefined,
    };

    setForm({ ...form, clothes: updated });
  };

  const remove = (index: number) => {
    setForm({
      ...form,
      clothes: clothesList.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4 overflow-auto">
      {/* Заголовок */}
      {clothesList.length > 0 && (
        <div className="grid grid-cols-12 gap-3 text-sm font-medium text-muted-foreground px-2">
          <div className="col-span-3">Название</div>
          <div className="col-span-1">Кол-во</div>
          <div className="col-span-2">Тип</div>
          <div className="col-span-2">Сезон</div>
          <div className="col-span-3">Размеры</div>
          <div className="col-span-1"></div>
        </div>
      )}

      {clothesList.map((item, index) => {
        const isFootwear = item.type === "FOOTWEAR";

        return (
          <div
            key={index}
            className="grid grid-cols-12 gap-3 items-center border rounded-lg p-3"
          >
            {/* Название */}
            <div className="col-span-3">
              <Input
                placeholder="Название"
                value={item.name}
                onChange={(e) => update(index, "name", e.target.value)}
              />
            </div>

            {/* Количество */}
            <div className="col-span-1">
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  update(index, "quantity", Number(e.target.value))
                }
              />
            </div>

            {/* Тип */}
            <div className="col-span-2">
              <Select
                value={item.type}
                onValueChange={(val) => changeType(index, val as ClothesType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Тип</SelectLabel>
                    <SelectItem value="CLOTHING">Одежда</SelectItem>
                    <SelectItem value="FOOTWEAR">Обувь</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Сезон */}
            <div className="col-span-2">
              <SeasonSelectForForms
                className="w-[120px]"
                selectedSeason={item.season as Season}
                onSelectChange={(val) => update(index, "season", val)}
              />
            </div>

            {/* Размеры */}
            <div className="col-span-3 flex gap-2">
              {!isFootwear && (
                <>
                  <SizeSelectForForms
                    type="CLOTHING"
                    className="w-[100px]"
                    selectedSize={item.clothingSizeId}
                    onSelectChange={(val) =>
                      update(index, "clothingSizeId", val)
                    }
                  />

                  <HeightSelectForForms
                    className="w-[100px]"
                    selectedHeight={item.clothingHeightId}
                    onSelectChange={(val) =>
                      update(index, "clothingHeightId", val)
                    }
                  />
                </>
              )}

              {isFootwear && (
                <SizeSelectForForms
                  type="FOOTWEAR"
                  selectedSize={item.footwearSizeId}
                  onSelectChange={(val) => update(index, "footwearSizeId", val)}
                />
              )}
            </div>

            {/* Удалить */}
            <div className="col-span-1">
              <Button size="sm" variant="ghost" onClick={() => remove(index)}>
                ✕
              </Button>
            </div>
          </div>
        );
      })}

      <Button variant="outline" onClick={addClothes}>
        + Добавить позицию
      </Button>
    </div>
  );
}
