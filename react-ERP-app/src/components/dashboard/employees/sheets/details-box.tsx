import { BootIcon } from "@/components/ui/boot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { positionMap } from "@/constants/positionMap";
import type { Employee } from "@/types/employee";
import { Building, HardHat, Phone, Shirt, User } from "lucide-react";

type EmployeeDetailsBoxProps = { employee: Employee };

export function EmployeeDetailsBox({ employee }: EmployeeDetailsBoxProps) {
  const fullName = [employee.lastName, employee.firstName, employee.fatherName]
    .filter(Boolean)
    .join(" ");
  return (
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
              <p className="font-medium">{positionMap[employee.position]}</p>
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
                {employee.clothingSize || "Не указан"}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Размер обуви</p>
            <div className="flex items-center gap-1">
              <BootIcon className="w-3 h-3 text-muted-foreground" />
              <p className="font-medium">
                {employee.footwearSize || "Не указан"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
