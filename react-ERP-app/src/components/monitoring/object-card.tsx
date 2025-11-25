import type { Object } from "@/types/object";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AlertTriangle, Building, Clock, MapPin, Phone } from "lucide-react";
import { Badge } from "../ui/badge";
import { useShiftsWithFilters } from "@/hooks/shift/useShift";
import { useState } from "react";
import { ShiftSheet } from "./shift-sheet";

type ObjectCardProps = {
  object: Object;
};

export function ObjectCard({ object }: ObjectCardProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data: shiftData } = useShiftsWithFilters(
    {
      objectId: object.id,
      fromDate: today.toISOString(),
      toDate: tomorrow.toISOString(),
    },
    true
  );

  const todayShift = shiftData?.[0] ?? null;
  const objectForeman = object.foreman ?? null;

  return (
    <>
      <Card
        className="hover:shadow-md transition-shadow duration-200 cursor-pointer h-full flex flex-col"
        onClick={() => setIsSheetOpen(true)}
      >
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg leading-tight mb-1 break-words">
                  {object.name}
                </CardTitle>
                <div className="flex items-start gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span className="break-words">{object.address}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {object.isPending && (
              <Badge
                variant="outline"
                className="text-orange-600 border-orange-600 text-xs"
              >
                <AlertTriangle className="w-3 h-3 mr-1" />
                На паузе
              </Badge>
            )}
            {shiftData?.length !== 0 ? (
              <Badge
                variant="secondary"
                className="text-green-700 bg-green-100 text-xs"
              >
                <Clock className="w-3 h-3 mr-1" />
                Смена активна
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="text-orange-700 bg-orange-100 text-xs"
              >
                <Clock className="w-3 h-3 mr-1" />
                Смена не открыта
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 flex-1 flex flex-col">
          {/* Foreman Info */}

          <div className="bg-muted p-3 rounded-lg">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Мастер</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="font-medium text-sm break-words">
                  {objectForeman
                    ? `${object.foreman?.lastName} ${object.foreman?.firstName}`
                    : "Не назначен"}
                </p>
                <div className="flex items-center gap-1 text-sm ">
                  <Phone className="w-3 h-3 flex-shrink-0" />
                  <span className="break-all">
                    {objectForeman ? `${object.foreman?.phone}` : "Не назначен"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Employee Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xl font-bold">
                {todayShift ? todayShift.employees.length : "0"}
              </div>
              <div className="text-xs text-blue-600 leading-tight">
                Всего сотрудников
              </div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xl font-bold">
                {todayShift
                  ? todayShift.employees.filter((employee) => employee.present)
                      .length
                  : "0"}
              </div>
              <div className="text-xs text-green-600 leading-tight">
                На смене
              </div>
            </div>
          </div>

          {/* Current Shift Info */}
          <div className="flex-1 flex flex-col justify-end">
            <div className="border border-primary bg-muted  p-3 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <p className="font-medium text-sm">Текущая смена</p>
                <Badge
                  variant="outline"
                  className="border-primary text-xs w-fit"
                >
                  {todayShift ? `${todayShift.plannedHours} ч.` : "0"}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="font-medium text-sm">Общее кол-во часов</p>
                <Badge
                  variant="outline"
                  className="border-primary text-xs w-fit"
                >
                  {todayShift ? `${todayShift.totalHours} ч.` : "0"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ShiftSheet
        object={object}
        shift={todayShift}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </>
  );
}
