// ClothesRequestDialog.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CreateClothesRequestDto } from "@/types/dto/clothes-request.dto";
import {
  useCreateClothesRequest,
  useUpdateClothesRequest,
} from "@/hooks/clothes-request/useClothesRequest";
import { useGetAllUsers } from "@/hooks/user/useGetAllUsers";
import {
  useClothingHeights,
  useClothingSizes,
  useFootwearSizes,
} from "@/hooks/clothes/useClothes";
import { Step1MainInfo } from "./steps/step-1-main-info";
import { Step3Clothes } from "./steps/step-3-clothes";
import { Step4Review } from "./steps/step-4-review";
import { useAuth } from "@/hooks/auth/useAuth";
import type { User } from "@/types/user";
import type { ClothesRequest } from "@/types/clothes-request";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ClothesRequest | null; // Если есть — мы в режиме редактирования
}

export function ClothesRequestDialog({
  open,
  onOpenChange,
  initialData,
}: Props) {
  const isEdit = !!initialData;
  const [step, setStep] = useState(1);
  const [isStep1Valid, setIsStep1Valid] = useState(false);
  const [isStep2Valid, setIsStep2Valid] = useState(false);

  const [form, setForm] = useState<CreateClothesRequestDto>({
    title: "",
    customer: "",
    participantsIds: [],
    clothes: [],
  });

  // Заполняем форму данными при редактировании
  useEffect(() => {
    if (open) {
      if (initialData) {
        // РЕЖИМ РЕДАКТИРОВАНИЯ
        setForm({
          title: initialData.title,
          customer: initialData.customer,
          // Маппим участников в массив ID
          participantsIds: initialData.participants?.map((p) => p.id) || [],
          // Маппим одежду, проверяя существование массива
          clothes:
            initialData.clothes?.map((c) => ({
              name: c.name,
              quantity: c.quantity,
              type: c.type,
              season: c.season,
              // В интерфейсе RequestClothes у тебя уже ID, а не объекты
              clothingSizeId: c.clothingSizeId || undefined,
              clothingHeightId: c.clothingHeightId || undefined,
              footwearSizeId: c.footwearSizeId || undefined,
            })) || [],
        });
      } else {
        // РЕЖИМ СОЗДАНИЯ
        setForm({
          title: "",
          customer: "",
          participantsIds: [],
          clothes: [],
        });
      }
      // Сбрасываем на первый шаг при каждом открытии
      setStep(1);
    }
  }, [initialData, open]);

  const { data: users = [] } = useGetAllUsers();
  const { data: clothesSizes = [] } = useClothingSizes();
  const { data: footwearSizes = [] } = useFootwearSizes();
  const { data: heights = [] } = useClothingHeights();
  const { data: me } = useAuth();

  const createMutation = useCreateClothesRequest();
  const updateMutation = useUpdateClothesRequest(initialData?.id || "");

  const currentMutation = isEdit ? updateMutation : createMutation;

  const handleSubmit = () => {
    currentMutation.mutate(form, {
      onSuccess: () => {
        onOpenChange(false);
        setStep(1);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[1250px] max-h-[90%] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Редактирование заявки" : "Создание новой заявки"}
          </DialogTitle>
        </DialogHeader>

        <div className="text-sm text-muted-foreground mb-4">
          Шаг {step} из 3
        </div>

        {step === 1 && (
          <Step1MainInfo
            form={form}
            setForm={setForm}
            users={users}
            onValidityChange={setIsStep1Valid}
            me={me as User}
          />
        )}
        {step === 2 && (
          <Step3Clothes
            form={form}
            setForm={setForm}
            onValidityChange={setIsStep2Valid}
          />
        )}
        {step === 3 && (
          <Step4Review
            form={form}
            users={users}
            clothesSizes={clothesSizes}
            footwearSizes={footwearSizes}
            heights={heights}
          />
        )}

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 1}
          >
            Назад
          </Button>

          {step < 3 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!isStep1Valid || (step === 2 && !isStep2Valid)}
            >
              Далее
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={currentMutation.isPending}>
              {isEdit ? "Сохранить изменения" : "Создать"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
