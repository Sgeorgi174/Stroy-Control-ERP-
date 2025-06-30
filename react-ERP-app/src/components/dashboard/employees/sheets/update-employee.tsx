import { ObjectSelectForForms } from "@/components/dashboard/select-object-for-form";
import { SizeSelectForForms } from "@/components/dashboard/select-size-for-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useObjects } from "@/hooks/object/useObject";
import { useForm } from "react-hook-form";
import { PositionSelectForForms } from "../../select-position-for-form";
import { useEmployeeSheetStore } from "@/stores/employee-sheet-store";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Employee } from "@/types/employee";
import { useUpdateEmployee } from "@/hooks/employee/useUpdateEmployee";

const employeeSchema = z.object({
  firstName: z.string().min(1, "Это поле обязательно"),
  lastName: z.string().min(1, "Это поле обязательно"),
  fatherName: z.string().min(1, "Это поле обязательно"),
  phoneNumber: z.string().min(1, "Это поле обязательно"),
  clothingSize: z.number().min(1, "Это поле обязательно"),
  footwearSize: z.number().min(1, "Это поле обязательно"),
  position: z.enum(
    ["FOREMAN", "ELECTRICAN", "LABORER", "DESIGNER", "ENGINEER"],
    { message: "Выберите должность" }
  ),
  objectId: z.string().min(1, { message: "Выберите объект" }),
});

type FormData = z.infer<typeof employeeSchema>;

type EmployeeUpdateProps = {
  employee: Employee;
};

export function EmployeeUpdate({ employee }: EmployeeUpdateProps) {
  const updateEmployeeMutation = useUpdateEmployee(employee.id);
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
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: employee.firstName,
      lastName: employee.lastName,
      fatherName: employee.fatherName,
      phoneNumber: employee.phoneNumber,
      clothingSize: employee.clothingSize,
      footwearSize: employee.footwearSize,
      position: employee.position,
      objectId: employee.workPlace?.id || "none",
    },
  });

  const { closeSheet } = useEmployeeSheetStore();

  const selectedObjectId = watch("objectId");
  const selectedPosition = watch("position");
  const selectedClothingSize = watch("clothingSize");
  const selectedFootewearSize = watch("footwearSize");

  const onSubmit = async (data: FormData) => {
    try {
      await updateEmployeeMutation.mutateAsync({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        fatherName: data.fatherName.trim(),
        clothingSize: data.clothingSize,
        footwearSize: data.footwearSize,
        position: data.position,
        objectId: data.objectId === "none" ? undefined : data.objectId,
        phoneNumber: data.phoneNumber,
      });

      reset();
      closeSheet();
    } catch (error) {
      console.error("Ошибка при создании сотрудника:", error);
    }
  };

  return (
    <div className="p-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 m-auto w-[700px]"
      >
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <Label htmlFor="lastName">Фамилия</Label>
            <Input
              className="w-[300px]"
              placeholder="Фамилия"
              id="lastName"
              type="text"
              {...register("lastName", { required: "Это поле обязательно" })}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="firstName">Имя</Label>
            <Input
              className="w-[300px]"
              placeholder="Имя"
              id="firstName"
              type="text"
              {...register("firstName", { required: "Это поле обязательно" })}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <Label htmlFor="fatherName">Отчество</Label>
            <Input
              className="w-[300px]"
              placeholder="Отчество"
              id="fatherName"
              type="text"
              {...register("fatherName", { required: "Это поле обязательно" })}
            />
            {errors.fatherName && (
              <p className="text-sm text-red-500">
                {errors.fatherName.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="phoneNumber">Номер телефона</Label>
            <Input
              className="w-[300px]"
              placeholder="+79999999999"
              id="phoneNumber"
              type="text"
              {...register("phoneNumber", { required: "Это поле обязательно" })}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />

        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <Label htmlFor="position">Должность</Label>
            <PositionSelectForForms
              className="w-[300px]"
              selectedPosition={selectedPosition}
              onSelectChange={(position) => setValue("position", position)}
            />
            {errors.position && (
              <p className="text-sm text-red-500">{errors.position.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="clothingSize">Размер одежды</Label>
            <SizeSelectForForms
              className="w-[300px]"
              onSelectChange={(clothingSize) =>
                setValue("clothingSize", clothingSize)
              }
              selectedSize={selectedClothingSize}
              type="CLOTHING"
            />
            {errors.clothingSize && (
              <p className="text-sm text-red-500">
                {errors.clothingSize.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <Label htmlFor="objectId">Объект</Label>
            <ObjectSelectForForms
              className="w-[300px]"
              isEmptyElement
              objects={objects}
              selectedObjectId={selectedObjectId}
              onSelectChange={(objectId) => {
                if (objectId) {
                  setValue("objectId", objectId);
                } else {
                  setValue("objectId", "");
                }
              }}
            />
            {errors.objectId && (
              <p className="text-sm text-red-500">{errors.objectId.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="footwearSize">Размер обуви</Label>
            <SizeSelectForForms
              className="w-[300px]"
              onSelectChange={(footwearSize) =>
                setValue("footwearSize", footwearSize)
              }
              selectedSize={selectedFootewearSize}
              type="FOOTWEAR"
            />
            {errors.footwearSize && (
              <p className="text-sm text-red-500">
                {errors.footwearSize.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <Button
            className="w-[300px]"
            type="submit"
            disabled={updateEmployeeMutation.isPending}
          >
            {updateEmployeeMutation.isPending ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>
      </form>
    </div>
  );
}
