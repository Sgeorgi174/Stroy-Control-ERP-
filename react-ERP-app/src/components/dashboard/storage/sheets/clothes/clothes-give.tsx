import type { Clothes } from "@/types/clothes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ObjectSelectForForms } from "@/components/dashboard/select-object-for-form";
import { Button } from "@/components/ui/button";
import { useClothesSheetStore } from "@/stores/clothes-sheet-store";
import { Label } from "@/components/ui/label";
import { EmployeeAutocomplete } from "@/components/dashboard/select-employee-for-form";
import { ClothesDetailsBox } from "./clothes-details-box";
import { useObjects } from "@/hooks/object/useObject";
import { useEmployees } from "@/hooks/employee/useEmployees";
import { useGiveClothes } from "@/hooks/clothes/useClothes";
import { useAuth } from "@/hooks/auth/useAuth";

type ClothesGiveProps = { clothes: Clothes };

export function ClothesGive({ clothes }: ClothesGiveProps) {
  const { data: user, isLoading: isUserLoading } = useAuth();
  console.log(user);

  const employeeObjectId =
    user?.role === "FOREMAN"
      ? user.primaryObjects?.some((o) => o.id === clothes.objectId) ||
        user.secondaryObjects?.some((o) => o.id === clothes.objectId)
        ? clothes.objectId
        : null // или "all", если тебе удобнее
      : "all";
  const { closeSheet } = useClothesSheetStore();
  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });

  const { data: employees = [] } = useEmployees(
    {
      searchQuery: "",
      objectId: employeeObjectId,
      type: "ACTIVE",
    },
    !isUserLoading
  );

  const giveClothesMutation = useGiveClothes(clothes.id);

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
  const selectedObjectId = watch("fromObjectId");

  const onSubmit = async (data: FormData) => {
    try {
      await giveClothesMutation.mutateAsync(data);
      reset();
      closeSheet();
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  return (
    <div className="p-5 flex flex-col gap-1">
      <ClothesDetailsBox clothes={clothes} />

      <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />

      <p className="text-center font-medium text-xl mt-5">Выдача</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between mt-10">
          <div className="flex flex-col gap-2">
            <Label>С какого склада</Label>
            <ObjectSelectForForms
              className="w-[300px]"
              disabled
              selectedObjectId={selectedObjectId}
              onSelectChange={(id) => {
                if (id !== null) {
                  setValue("fromObjectId", id);
                }
              }}
              objects={objects}
            />
          </div>

          <div className="flex flex-col gap-2">
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
        </div>
        <div className="flex justify-center mt-15">
          <Button type="submit" className="w-[300px]">
            Выдать
          </Button>
        </div>
      </form>
    </div>
  );
}
