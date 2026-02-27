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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  dob: z.string().min(1, "Это поле обязательно"),
  startWorkDate: z.string().min(1, "Это поле обязательно"),
  issueDate: z.string().min(1, "Это поле обязательно"),
  registrationRegion: z.string().min(1, "Это поле обязательно"),
  registrationCity: z.string().min(1, "Это поле обязательно"),
  registrationStreet: z.string().min(1, "Это поле обязательно"),
  registrationBuild: z.string().min(1, "Это поле обязательно"),
  registrationFlat: z.string(),
  position: z.string(),
  country: z.enum(["RU", "KZ", "KG", "TJ", "BY", "AZ"], {
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
      country: employee.country as FormData["country"],
      passportNumber: employee.passportNumber,
      passportSerial: employee.passportSerial,
      whereIssued: employee.whereIssued,
      issueDate: employee.issueDate,
      registrationRegion: employee.registrationRegion,
      registrationCity: employee.registrationCity,
      registrationStreet: employee.registrationStreet,
      registrationBuild: employee.registrationBuild,
      registrationFlat: employee.registrationFlat,
      dob: employee.dob,
      startWorkDate: employee.startWorkDate,
    },
  });

  const { closeSheet } = useEmployeeSheetStore();

  const selectedObjectId = watch("objectId");
  const selectedPosition = watch("position");
  const selectedClosthingSize = watch("clothingSizeId");
  const selectedFootwearSize = watch("footwearSizeId");
  const selectedClothingHeight = watch("clothingHeightId");
  // Приведение типа, чтобы избежать ошибки TS2367
  const selectedCountry = watch("country") as FormData["country"];

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
        dob: data.dob,
        startWorkDate: data.startWorkDate,
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
        {/* ФИО */}
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <Label htmlFor="lastName">Фамилия</Label>
            <Input
              className="w-[300px]"
              id="lastName"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="firstName">Имя</Label>
            <Input
              className="w-[300px]"
              id="firstName"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>
        </div>

        {/* Отчество и ДР */}
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <Label htmlFor="fatherName">Отчество</Label>
            <Input
              className="w-[300px]"
              id="fatherName"
              {...register("fatherName")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="dob">Дата рождения</Label>
            <DatePicker
              selected={watch("dob") || undefined}
              onSelect={(dateStr) =>
                setValue("dob", dateStr || "", { shouldValidate: true })
              }
            />
          </div>
        </div>

        {/* Телефон и Должность */}
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <Label htmlFor="phoneNumber">Номер телефона</Label>
            <Input
              className="w-[300px]"
              id="phoneNumber"
              {...register("phoneNumber")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="position">Должность</Label>
            <PositionSelectForForms
              className="w-[300px]"
              selectedPosition={selectedPosition as Positions}
              onSelectChange={(pos) => setValue("position", pos)}
            />
          </div>
        </div>

        <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />

        {/* Объект и Размеры */}
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <Label htmlFor="objectId">Объект</Label>
            <ObjectSelectForForms
              className="w-[300px]"
              isEmptyElement
              objects={objects}
              selectedObjectId={selectedObjectId}
              onSelectChange={(id) => setValue("objectId", id || "")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="footwearSize">Размер обуви</Label>
            <SizeSelectForForms
              className="w-[300px]"
              onSelectChange={(val) => setValue("footwearSizeId", val)}
              selectedSize={selectedFootwearSize}
              type="FOOTWEAR"
            />
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <Label htmlFor="clothingSize">Размер одежды</Label>
            <SizeSelectForForms
              className="w-[300px]"
              onSelectChange={(val) => setValue("clothingSizeId", val)}
              selectedSize={selectedClosthingSize}
              type="CLOTHING"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Ростовка</Label>
            <HeightSelectForForms
              className="w-[300px]"
              selectedHeight={selectedClothingHeight}
              onSelectChange={(val) => setValue("clothingHeightId", val)}
            />
          </div>
        </div>

        <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />

        {/* 📄 Паспортные данные */}
        <div className="flex flex-col gap-6">
          <p className="text-center text-xl">Паспортные данные</p>

          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <Label htmlFor="country">Гражданство</Label>
              <SelectCountry
                selectedCountry={selectedCountry}
                onSelectChange={(country) => {
                  setValue("country", country, { shouldValidate: true });

                  // Логика автоподстановки при смене страны
                  let code = "";
                  switch (country) {
                    case "KZ":
                      code = "KZT";
                      break;
                    case "KG":
                      code = "KGZ";
                      break;
                    case "AZ":
                      code = "AZE";
                      break;
                    case "TJ":
                      code = "TJK";
                      break;
                    case "BY":
                      code = "BYN";
                      break;
                    default:
                      code = "";
                  }
                  setValue("passportSerial", code, { shouldValidate: true });
                }}
              />
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <Label htmlFor="passportSerial">
                {selectedCountry === "RU" ? "Серия" : "Код"}
              </Label>

              {selectedCountry === "KZ" ? (
                <Select
                  value={watch("passportSerial")}
                  onValueChange={(val) =>
                    setValue("passportSerial", val, { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Выберите код" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KZT">KZT</SelectItem>
                    <SelectItem value="KAZ">KAZ</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  className="w-[300px]"
                  placeholder={
                    selectedCountry === "RU" ? "1234" : "Код паспорта"
                  }
                  id="passportSerial"
                  readOnly={
                    selectedCountry !== "RU" &&
                    (selectedCountry as string) !== "KZ"
                  }
                  {...register("passportSerial")}
                />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="passportNumber">Номер</Label>
              <Input
                className="w-[300px]"
                id="passportNumber"
                {...register("passportNumber")}
              />
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <Label htmlFor="whereIssued">Кем выдан</Label>
              <Input
                className="w-[300px]"
                id="whereIssued"
                {...register("whereIssued")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="issueDate">Дата выдачи</Label>
              <DatePicker
                selected={watch("issueDate") || undefined}
                onSelect={(dateStr) => setValue("issueDate", dateStr || "")}
              />
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
                id="registrationRegion"
                {...register("registrationRegion")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="registrationCity">Населенный пункт</Label>
              <Input
                className="w-[300px]"
                id="registrationCity"
                {...register("registrationCity")}
              />
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <Label htmlFor="registrationStreet">Улица</Label>
              <Input
                className="w-[300px]"
                id="registrationStreet"
                {...register("registrationStreet")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="registrationBuild">Дом</Label>
              <Input
                className="w-[300px]"
                id="registrationBuild"
                {...register("registrationBuild")}
              />
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
