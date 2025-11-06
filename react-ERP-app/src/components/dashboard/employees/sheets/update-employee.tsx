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
import { HeightSelectForForms } from "../../select-height-for-form";
import { DatePicker } from "@/components/ui/date-picker";
import { SelectCountry } from "../select-country";
import { useUpdateEmployee } from "@/hooks/employee/useUpdateEmployee";
import type { Employee, Positions } from "@/types/employee";
import { useEffect } from "react";

const employeeSchema = z.object({
  firstName: z.string().min(1, "Это поле обязательно"),
  lastName: z.string().min(1, "Это поле обязательно"),
  fatherName: z.string().min(1, "Это поле обязательно"),
  phoneNumber: z.string().min(1, "Это поле обязательно"),
  clothingSizeId: z.string().min(1, "Это поле обязательно"),
  footwearSizeId: z.string().min(1, "Это поле обязательно"),
  clothingHeightId: z.string().min(1, "Это поле обязательно"),
  passportSerial: z.string().min(1, "Это поле обязательно"),
  passportNumber: z.string().min(1, "Это поле обязательно"),
  whereIssued: z.string().min(1, "Это поле обязательно"),
  issueDate: z.string().min(1, "Это поле обязательно"),
  registrationRegion: z.string().min(1, "Это поле обязательно"),
  registrationCity: z.string().min(1, "Это поле обязательно"),
  registrationStreet: z.string().min(1, "Это поле обязательно"),
  registrationBuild: z.string().min(1, "Это поле обязательно"),
  registrationFlat: z.string(),
  position: z.string(),
  country: z.enum(["RU", "KZ", "KG", "TJ", "BY"], {
    message: "Выберите страну",
  }),
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
      clothingSizeId: employee.clothingSize.id,
      footwearSizeId: employee.footwearSize.id,
      clothingHeightId: employee.clothingHeight.id,
      position: employee.position,
      objectId: employee.objectId,
      country: employee.country,
      passportNumber: employee.passportNumber,
      whereIssued: employee.whereIssued,
      issueDate: employee.issueDate,
      registrationRegion: employee.registrationRegion,
      registrationCity: employee.registrationCity,
      registrationStreet: employee.registrationStreet,
      registrationBuild: employee.registrationBuild,
      registrationFlat: employee.registrationFlat,
    },
  });

  const { closeSheet } = useEmployeeSheetStore();

  const selectedObjectId = watch("objectId");
  const selectedPosition = watch("position");
  const selectedClosthingSize = watch("clothingSizeId");
  const selectedFootwearSize = watch("footwearSizeId");
  const selectedClothingHeight = watch("clothingHeightId");
  const selectedCountry = watch("country");

  useEffect(() => {
    if (selectedCountry !== "RU") {
      const code =
        selectedCountry === "KZ"
          ? "KZT"
          : selectedCountry === "KG"
          ? "KGZ"
          : selectedCountry === "TJ"
          ? "TJK"
          : selectedCountry === "BY"
          ? "BYN"
          : "";

      setValue("passportSerial", code, { shouldValidate: true });
    }
  }, [selectedCountry, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      await updateEmployeeMutation.mutateAsync({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        fatherName: data.fatherName.trim(),
        clothingSizeId: data.clothingSizeId,
        footwearSizeId: data.footwearSizeId,
        clothingHeightId: data.clothingHeightId,
        position: data.position as Positions,
        objectId: data.objectId === "none" ? undefined : data.objectId,
        phoneNumber: data.phoneNumber,
        passportSerial: data.passportSerial,
        passportNumber: data.passportNumber,
        whereIssued: data.whereIssued,
        issueDate: data.issueDate,
        registrationRegion: data.registrationRegion,
        registrationCity: data.registrationCity,
        registrationStreet: data.registrationStreet,
        registrationBuild: data.registrationBuild,
        registrationFlat: data.registrationFlat,
        country: data.country,
      });

      reset();
      closeSheet();
    } catch (error) {
      console.error("Ошибка при обновлении сотрудника:", error);
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
              selectedPosition={selectedPosition as Positions}
              onSelectChange={(position) => setValue("position", position)}
            />
            {errors.position && (
              <p className="text-sm text-red-500">{errors.position.message}</p>
            )}
          </div>

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
        </div>

        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <Label htmlFor="clothingSize">Размер одежды</Label>
            <SizeSelectForForms
              className="w-[300px]"
              onSelectChange={(clothingSize) =>
                setValue("clothingSizeId", clothingSize)
              }
              selectedSize={selectedClosthingSize}
              type="CLOTHING"
            />
            {errors.clothingSizeId && (
              <p className="text-sm text-red-500">
                {errors.clothingSizeId.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Ростовка</Label>
            <HeightSelectForForms
              className="w-[300px]"
              selectedHeight={selectedClothingHeight}
              onSelectChange={(height) => setValue("clothingHeightId", height)}
            />
            {errors.clothingHeightId && (
              <p className="text-sm text-red-500">
                {errors.clothingHeightId.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <Label htmlFor="footwearSize">Размер обуви</Label>
            <SizeSelectForForms
              className="w-[300px]"
              onSelectChange={(footwearSize) =>
                setValue("footwearSizeId", footwearSize)
              }
              selectedSize={selectedFootwearSize}
              type="FOOTWEAR"
            />
            {errors.footwearSizeId && (
              <p className="text-sm text-red-500">
                {errors.footwearSizeId.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />

        {/* 📄 Паспортные данные */}
        <div className="flex flex-col gap-6">
          <p className="text-center text-xl">Паспортные данные</p>

          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <Label htmlFor="passportSerial">Гражданство</Label>
              <SelectCountry
                selectedCountry={selectedCountry}
                onSelectChange={(country) => setValue("country", country)}
              />
              {errors.country && (
                <p className="text-sm text-red-500">{errors.country.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <Label htmlFor="passportSerial">
                {selectedCountry === "RU" ? "Серия" : "Код"}
              </Label>
              <Input
                className="w-[300px]"
                placeholder={
                  selectedCountry === "RU" ? "1234" : "KZT / KGZ / TJK"
                }
                id="passportSerial"
                type="text"
                value={
                  selectedCountry === "RU"
                    ? watch("passportSerial")
                    : selectedCountry === "KZ"
                    ? "KZT"
                    : selectedCountry === "KG"
                    ? "KGZ"
                    : selectedCountry === "TJ"
                    ? "TJK"
                    : watch("passportSerial")
                }
                readOnly={selectedCountry !== "RU"}
                onChange={(e) => {
                  if (selectedCountry === "RU") {
                    setValue("passportSerial", e.target.value, {
                      shouldValidate: true,
                    });
                  }
                }}
              />
              {errors.passportSerial && (
                <p className="text-sm text-red-500">
                  {errors.passportSerial.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="passportNumber">Номер</Label>
              <Input
                className="w-[300px]"
                placeholder="567890"
                id="passportNumber"
                type="text"
                {...register("passportNumber")}
              />
              {errors.passportNumber && (
                <p className="text-sm text-red-500">
                  {errors.passportNumber.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <Label htmlFor="whereIssued">Кем выдан</Label>
              <Input
                className="w-[300px]"
                placeholder="ГУ МВД России по г. Москве"
                id="whereIssued"
                type="text"
                {...register("whereIssued")}
              />
              {errors.whereIssued && (
                <p className="text-sm text-red-500">
                  {errors.whereIssued.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="issueDate">Дата выдачи</Label>
              <DatePicker
                selected={watch("issueDate") || undefined} // передаём строку напрямую
                onSelect={(dateStr) => setValue("issueDate", dateStr || "")}
              />
              {errors.issueDate && (
                <p className="text-sm text-red-500">
                  {errors.issueDate.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />

        {/* 🏠 Адрес регистрации */}
        <div className="flex flex-col gap-6">
          <p className="text-center text-xl">Адрес регистрации</p>

          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <Label htmlFor="registrationRegion">Регион</Label>
              <Input
                className="w-[300px]"
                placeholder="Московская область"
                id="registrationRegion"
                type="text"
                {...register("registrationRegion")}
              />
              {errors.registrationRegion && (
                <p className="text-sm text-red-500">
                  {errors.registrationRegion.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="registrationCity">Город</Label>
              <Input
                className="w-[300px]"
                placeholder="Москва"
                id="registrationCity"
                type="text"
                {...register("registrationCity")}
              />
              {errors.registrationCity && (
                <p className="text-sm text-red-500">
                  {errors.registrationCity.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <Label htmlFor="registrationStreet">Улица</Label>
              <Input
                className="w-[300px]"
                placeholder="ул. Ленина"
                id="registrationStreet"
                type="text"
                {...register("registrationStreet")}
              />
              {errors.registrationStreet && (
                <p className="text-sm text-red-500">
                  {errors.registrationStreet.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="registrationBuild">Дом</Label>
              <Input
                className="w-[300px]"
                placeholder="12"
                id="registrationBuild"
                type="text"
                {...register("registrationBuild")}
              />
              {errors.registrationBuild && (
                <p className="text-sm text-red-500">
                  {errors.registrationBuild.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <Label htmlFor="registrationFlat">Квартира (необязательно)</Label>
              <Input
                className="w-[300px]"
                placeholder="45"
                id="registrationFlat"
                type="text"
                {...register("registrationFlat")}
              />
              {errors.registrationFlat && (
                <p className="text-sm text-red-500">
                  {errors.registrationFlat.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <Button
            className="w-[300px]"
            type="submit"
            disabled={updateEmployeeMutation.isPending}
          >
            {updateEmployeeMutation.isPending
              ? "Обновление..."
              : "Обновить сотрудника"}
          </Button>
        </div>
      </form>
    </div>
  );
}
