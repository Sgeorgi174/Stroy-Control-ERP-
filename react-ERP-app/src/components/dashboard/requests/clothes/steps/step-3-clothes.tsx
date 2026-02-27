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
import { useClothesCatalog } from "@/hooks/clothes/useClothes";
import { useEffect, useCallback, memo } from "react";

type Props = {
  form: CreateClothesRequestDto;
  setForm: React.Dispatch<React.SetStateAction<CreateClothesRequestDto>>;
  onValidityChange?: (isValid: boolean) => void;
};

// Карточка одной позиции одежды
type ClothesItemProps = {
  index: number;
  item: NonNullable<CreateClothesRequestDto["clothes"]>[number];
  coll?: { name: string; type: ClothesType; season: Season }[];
  update: (index: number, field: string, value: any) => void;
  changeType: (index: number, value: ClothesType) => void;
  remove: (index: number) => void;
};

const ClothesItem = memo(function ClothesItem({
  index,
  item,
  coll,
  update,
  changeType,
  remove,
}: ClothesItemProps) {
  const isFootwear = item.type === "FOOTWEAR";

  return (
    <div className="grid grid-cols-12 gap-3 items-center border rounded-lg p-3">
      {/* Название */}
      <div className="col-span-3">
        <Select
          value={item.name}
          onValueChange={(val) => {
            const selected = coll?.find((c) => c.name === val);
            if (!selected) return;
            update(index, "name", selected.name);
            update(index, "type", selected.type);
            update(index, "season", selected.season);
            update(index, "clothingSizeId", undefined);
            update(index, "clothingHeightId", undefined);
            update(index, "footwearSizeId", undefined);
          }}
        >
          <SelectTrigger className="w-[260px]">
            <SelectValue placeholder="Выберите позицию" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Позиции</SelectLabel>
              {coll?.map((c) => (
                <SelectItem key={c.name} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Количество */}
      <div className="col-span-1">
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => update(index, "quantity", Number(e.target.value))}
        />
      </div>

      {/* Тип */}
      <div className="col-span-2">
        <Select
          value={item.type}
          onValueChange={(val) => changeType(index, val as ClothesType)}
          disabled
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
          disabled
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
              onSelectChange={(val) => update(index, "clothingSizeId", val)}
            />
            <HeightSelectForForms
              className="w-[100px]"
              selectedHeight={item.clothingHeightId}
              onSelectChange={(val) => update(index, "clothingHeightId", val)}
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
});

export function Step3Clothes({ form, setForm, onValidityChange }: Props) {
  const clothesList = form.clothes || [];
  const { data: coll } = useClothesCatalog();

  const addClothes = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      clothes: [
        ...(prev.clothes || []),
        { type: "CLOTHING", season: "SUMMER", name: "", quantity: 1 },
      ],
    }));
  }, [setForm]);

  const update = useCallback(
    (index: number, field: string, value: any) => {
      setForm((prev) => {
        const updated = [...(prev.clothes || [])];
        updated[index] = { ...updated[index], [field]: value };
        return { ...prev, clothes: updated };
      });
    },
    [setForm],
  );

  const changeType = useCallback(
    (index: number, value: ClothesType) => {
      setForm((prev) => {
        const updated = [...(prev.clothes || [])];
        updated[index] = {
          ...updated[index],
          type: value,
          clothingSizeId: undefined,
          clothingHeightId: undefined,
          footwearSizeId: undefined,
        };
        return { ...prev, clothes: updated };
      });
    },
    [setForm],
  );

  const remove = useCallback(
    (index: number) => {
      setForm((prev) => ({
        ...prev,
        clothes: (prev.clothes || []).filter((_, i) => i !== index),
      }));
    },
    [setForm],
  );

  const isItemValid = useCallback((item: (typeof clothesList)[number]) => {
    if (!item.name) return false;
    if (!item.quantity || item.quantity <= 0) return false;
    if (item.type === "CLOTHING")
      return !!item.clothingSizeId && !!item.clothingHeightId;
    if (item.type === "FOOTWEAR") return !!item.footwearSizeId;
    return false;
  }, []);

  const isValid = clothesList.length === 0 || clothesList.every(isItemValid);

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

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

      {clothesList.map((item, index) => (
        <ClothesItem
          key={index}
          index={index}
          item={item}
          coll={coll}
          update={update}
          changeType={changeType}
          remove={remove}
        />
      ))}

      <Button onClick={addClothes}>+ Добавить позицию</Button>
    </div>
  );
}
