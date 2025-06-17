import type { Clothes } from "@/types/clothes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { objects } from "@/constants/objects";
import toast from "react-hot-toast";
import { ObjectSelectForForms } from "@/components/dashboard/select-object-for-form";
import { Button } from "@/components/ui/button";
import { useClothesSheetStore } from "@/stores/clothes-sheet-store";
import { Label } from "@/components/ui/label";
import { EmployeeAutocomplete } from "@/components/dashboard/select-employee-for-form";
import { employees } from "@/constants/employees";

type ClothesGiveProps = { clothes: Clothes };

export function ClothesGive({ clothes }: ClothesGiveProps) {
  const { closeSheet } = useClothesSheetStore();

  // Валидация без quantity, employeeId — обязательный
  const formSchema = z.object({
    fromObjectId: z.string(),
    employeeId: z.string().min(1, { message: "Сотрудник обязателен" }),
  });

  type FormData = z.infer<typeof formSchema>;

  const {
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromObjectId: clothes.objectId,
      employeeId: "",
    },
  });

  const selectedEmployeeId = watch("employeeId");

  const onSubmit = (data: FormData) => {
    try {
      console.log("Собранные данные:", {
        clotheId: clothes.id,
        employeeId: data.employeeId,
      });
      reset();
      closeSheet();
      toast.success("Успешно перемещен комплект одежды");
    } catch (error) {
      toast.error("Не удалось переместить комплект одежды");
      console.error("Ошибка:", error);
    }
  };

  return (
    <div className="p-5 flex flex-col gap-1">
      <p>
        Наименование: <span className="font-medium">{clothes.name}</span>
      </p>
      <p>
        Размер: <span className="font-medium">{clothes.size}</span>
      </p>
      <p>
        Сезон:{" "}
        <span className="font-medium">
          {clothes.season === "SUMMER" ? "Лето" : "Зима"}
        </span>
      </p>
      <p>
        Количество: <span className="font-medium">{clothes.quantity}</span>
      </p>
      <p>
        В пути: <span className="font-medium">{clothes.inTransit}</span>
      </p>
      <p>
        Место хранения:{" "}
        <span className="font-medium">{clothes.storage.name}</span>
      </p>

      <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />

      <p className="text-center font-medium text-xl mt-5">Выдача</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between mt-10 px-10">
          <div className="flex flex-col gap-2 w-[250px]">
            <Label>Укажите сотрудника *</Label>
            <EmployeeAutocomplete
              employees={employees}
              onSelectChange={(employeeId) =>
                setValue("employeeId", employeeId, { shouldValidate: true })
              }
              selectedEmployeeId={selectedEmployeeId}
            />
            {errors.employeeId && (
              <p className="text-sm text-red-500">
                {errors.employeeId.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label>С какого склада</Label>
            <ObjectSelectForForms
              disabled
              selectedObjectId={clothes.objectId}
              onSelectChange={(id) => setValue("fromObjectId", id)}
              objects={objects}
            />
          </div>
        </div>
        <div className="flex justify-center mt-15">
          <Button type="submit" className="w-[200px]">
            Выдать
          </Button>
        </div>
      </form>
    </div>
  );
}
