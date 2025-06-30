import { ObjectSelectForForms } from "@/components/dashboard/select-object-for-form";
import { SizeSelectForForms } from "@/components/dashboard/select-size-for-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clothisngSizes, shoesSizes } from "@/constants/sizes";
import { useCreateEmployee } from "@/hooks/employee/useCreateEmployee";
import { useObjects } from "@/hooks/object/useObject";
import { useForm } from "react-hook-form";
import { PositionSelectForForms } from "../../select-position-for-form";
import { useEmployeeSheetStore } from "@/stores/employee-sheet-store";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { useSkill } from "@/hooks/skill/useSkill";
import { Checkbox } from "@/components/ui/checkbox";

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
  skillIds: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof employeeSchema>;

export function EmployeeCreate() {
  const createEmployeeMutation = useCreateEmployee();
  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });
  const { data: skills = [] } = useSkill();

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
      firstName: "",
      lastName: "",
      fatherName: "",
      phoneNumber: "",
      clothingSize: Number(clothisngSizes[0]),
      footwearSize: Number(shoesSizes[0]),
      position: undefined,
      objectId: "",
      skillIds: [],
    },
  });

  const { closeSheet } = useEmployeeSheetStore();

  const selectedObjectId = watch("objectId");
  const selectedPosition = watch("position");
  const selectedClothingSize = watch("clothingSize");
  const selectedFootewearSize = watch("footwearSize");
  const selectedSkillIds = watch("skillIds");

  const onSubmit = async (data: FormData) => {
    try {
      await createEmployeeMutation.mutateAsync({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        fatherName: data.fatherName.trim(),
        clothingSize: data.clothingSize,
        footwearSize: data.footwearSize,
        position: data.position,
        objectId: data.objectId === "none" ? undefined : data.objectId,
        phoneNumber: data.phoneNumber,
        skillIds: data.skillIds || [],
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

        <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />

        <p className="text-center text-xl">Навыки</p>
        <Card className="grid grid-cols-3 gap-x-1 gap-y-3 p-3">
          {skills.map((skill) => {
            return (
              <div
                className="flex flex-row items-center gap-2 px-3"
                key={skill.id}
              >
                <Checkbox
                  checked={
                    selectedSkillIds && selectedSkillIds.includes(skill.id)
                  }
                  onCheckedChange={(checked) => {
                    const currentSkills = watch("skillIds") || [];
                    if (checked) {
                      setValue("skillIds", [...currentSkills, skill.id]);
                    } else {
                      setValue(
                        "skillIds",
                        currentSkills.filter((id) => id !== skill.id)
                      );
                    }
                  }}
                />
                <p>{skill.skill}</p>
              </div>
            );
          })}
        </Card>

        <div className="flex justify-center mt-10">
          <Button
            className="w-[300px]"
            type="submit"
            disabled={createEmployeeMutation.isPending}
          >
            {createEmployeeMutation.isPending
              ? "Добавление..."
              : "Добавить сотрудника"}
          </Button>
        </div>
      </form>
    </div>
  );
}
