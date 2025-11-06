import { BootIcon } from "@/components/ui/boot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/format-date";
import type { Employee } from "@/types/employee";
import {
  Building,
  FileText,
  HardHat,
  MapPinCheck,
  Phone,
  Shirt,
  User,
} from "lucide-react";

type EmployeeDetailsBoxProps = { employee: Employee };

export function EmployeeDetailsBox({ employee }: EmployeeDetailsBoxProps) {
  const fullName = [employee.lastName, employee.firstName, employee.fatherName]
    .filter(Boolean)
    .join(" ");

  console.log(employee);

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5" />
            Информация о сотруднике
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground ">Полное имя</p>
              <div className="flex items-center gap-1">
                <User className="w-3 h-3 text-muted-foreground" />
                <p className="font-medium">{fullName}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Телефон</p>
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-muted-foreground" />
                <p className="font-medium">{employee.phoneNumber}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Должность</p>
              <div className="flex items-center gap-1">
                <HardHat className="w-3 h-3 text-muted-foreground" />
                <p className="font-medium">{employee.position}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Место работы</p>
              <div className="flex items-center gap-1">
                <Building className="w-3 h-3 text-muted-foreground" />
                <p className="font-medium">
                  {employee.workPlace ? employee.workPlace.name : "-"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Размер одежды</p>
              <div className="flex items-center gap-1">
                <Shirt className="w-3 h-3 text-muted-foreground" />
                <p className="font-medium">
                  {employee.clothingSize.size || "Не указан"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ростовка одежды</p>
              <div className="flex items-center gap-1">
                <Shirt className="w-3 h-3 text-muted-foreground" />
                <p className="font-medium">
                  {employee.clothingHeight.height || "Не указан"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Размер обуви</p>
              <div className="flex items-center gap-1">
                <BootIcon className="w-3 h-3 text-muted-foreground" />
                <p className="font-medium">
                  {employee.footwearSize.size || "Не указан"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Паспортные данные
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground ">
                {employee.country !== "RU" ? "Код" : "Серия"}
              </p>
              <div className="flex items-center gap-1">
                <p className="font-medium">{employee.passportSerial}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Номер</p>
              <div className="flex items-center gap-1">
                <p className="font-medium">{employee.passportNumber}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Кем выдан</p>
              <div className="flex items-center gap-1">
                <p className="font-medium">{employee.whereIssued}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Дата выдачи</p>
              <div className="flex items-center gap-1">
                <p className="font-medium">{formatDate(employee.issueDate)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPinCheck className="w-5 h-5" />
            Адрес регистрации
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground ">Регион</p>
              <div className="flex items-center gap-1">
                <p className="font-medium">{employee.registrationRegion}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Город</p>
              <div className="flex items-center gap-1">
                <p className="font-medium">{employee.registrationCity}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Улица</p>
              <div className="flex items-center gap-1">
                <p className="font-medium">{employee.registrationStreet}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Строение</p>
              <div className="flex items-center gap-1">
                <p className="font-medium">{employee.registrationBuild}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Квартира</p>
              <div className="flex items-center gap-1">
                <p className="font-medium">
                  {employee.registrationFlat ? employee.registrationFlat : "-"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
