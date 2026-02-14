// CreateClothesRequestDialog.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CreateClothesRequestDto } from "@/types/dto/clothes-request.dto";
import { useCreateClothesRequest } from "@/hooks/clothes-request/useClothesRequest";
import { useGetAllUsers } from "@/hooks/user/useGetAllUsers";
import {
  useClothingHeights,
  useClothingSizes,
  useFootwearSizes,
} from "@/hooks/clothes/useClothes";

import { Step1MainInfo } from "./steps/step-1-main-info";
import { Step3Clothes } from "./steps/step-3-clothes";
import { Step4Review } from "./steps/step-4-review";

export function CreateClothesRequestDialog() {
  const [step, setStep] = useState(1);
  const { mutate, isPending } = useCreateClothesRequest();

  const [form, setForm] = useState<CreateClothesRequestDto>({
    title: "",
    customer: "",
    participantsIds: [],
    clothes: [],
  });

  // Получаем пользователей один раз
  const { data: users = [] } = useGetAllUsers();

  // Получаем размеры и ростовки один раз
  const { data: clothesSizes = [] } = useClothingSizes();
  const { data: footwearSizes = [] } = useFootwearSizes();
  const { data: heights = [] } = useClothingHeights();

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const handleSubmit = () => {
    mutate(form);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Создать заявку</Button>
      </DialogTrigger>

      <DialogContent className="min-w-[1250px]">
        <div className="text-sm text-muted-foreground mb-4">
          Шаг {step} из 3
        </div>

        {step === 1 && (
          <Step1MainInfo form={form} setForm={setForm} users={users} />
        )}
        {step === 2 && <Step3Clothes form={form} setForm={setForm} />}
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
          {step > 1 && (
            <Button variant="outline" onClick={back}>
              Назад
            </Button>
          )}
          {step < 3 && <Button onClick={next}>Далее</Button>}
          {step === 3 && (
            <Button onClick={handleSubmit} disabled={isPending}>
              Создать
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
