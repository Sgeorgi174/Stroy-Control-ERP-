import { Badge } from "@/components/ui/badge";
import { BootIcon } from "@/components/ui/boot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/format-date";
import type { Employee } from "@/types/employee";
import {
  AlertCircle,
  Building,
  FileText,
  Gavel,
  HardHat,
  MapPinCheck,
  Phone,
  Shirt,
  User,
} from "lucide-react";

type EmployeeDetailsBoxProps = { employee: Employee; isWarning: boolean };

export function EmployeeDetailsBox({
  employee,
  isWarning,
}: EmployeeDetailsBoxProps) {
  const fullName = [employee.lastName, employee.firstName, employee.fatherName]
    .filter(Boolean)
    .join(" ");

  const penaltyStatusMap: Record<string, { label: string; variant: string }> = {
    PENDING: { label: "Ожидает", variant: "outline" },
    APPROVED: { label: "Одобрен", variant: "secondary" },
    PROCESSED: { label: "Выплачен", variant: "default" },
    REJECTED: { label: "Отклонен", variant: "destructive" },
    CANCELED: { label: "Отменен", variant: "destructive" },
  };

  const activePenalties = employee.penalties.filter(
    (p) => p.status !== "REJECTED" && p.status !== "CANCELED",
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Информация о сотруднике */}
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
              <p className="text-sm text-muted-foreground">Дата рождения</p>
              <div className="flex items-center gap-1">
                <HardHat className="w-3 h-3 text-muted-foreground" />
                <p className="font-medium">{formatDate(employee.dob)}</p>
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
              <p className="text-sm text-muted-foreground">
                Дата начала работы
              </p>
              <div className="flex items-center gap-1">
                <Shirt className="w-3 h-3 text-muted-foreground" />
                <p className="font-medium">
                  {formatDate(employee.startWorkDate)}
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

      {/* Паспортные данные */}
      <Card className={`${isWarning ? "bg-yellow-300/10" : ""}`}>
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

      {/* Адрес регистрации */}
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
              <p className="text-sm text-muted-foreground">Населенный пункт</p>
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

      {/* Штрафы — теперь в общем стиле без выделения цветом и суммами */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gavel className="w-5 h-5 text-muted-foreground" />
              Штрафы
            </div>
            {activePenalties.length > 0 && (
              <Badge
                variant="outline"
                className="font-normal text-muted-foreground"
              >
                Всего: {activePenalties.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activePenalties.length > 0 ? (
            <div className="flex flex-col gap-3">
              {activePenalties.map((penalty) => (
                <div
                  key={penalty.id}
                  className="flex items-center justify-between py-2 border-b last:border-0 last:pb-0"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {penalty.reason}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(penalty.date)} • {penalty.object?.name || "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold whitespace-nowrap">
                      {penalty.amount.toLocaleString()} ₽
                    </span>
                    <Badge
                      variant={penaltyStatusMap[penalty.status]?.variant as any}
                      className="text-[10px] px-2 h-5"
                    >
                      {penaltyStatusMap[penalty.status]?.label ||
                        penalty.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <AlertCircle className="w-4 h-4" />
              Актуальных штрафов нет
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
