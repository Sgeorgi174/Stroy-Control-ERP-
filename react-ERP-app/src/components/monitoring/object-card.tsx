import type { Object } from "@/types/object";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AlertTriangle, Building, Clock, MapPin, Phone } from "lucide-react";
import { Badge } from "../ui/badge";

type ObjectCardProps = {
  object: Object;
};

export function ObjectCard({ object }: ObjectCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer h-full flex flex-col">
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
          {object && (
            <Badge
              variant="secondary"
              className="text-green-700 bg-green-100 text-xs"
            >
              <Clock className="w-3 h-3 mr-1" />
              Смена активна
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col">
        {/* Foreman Info */}
        {object.foreman && (
          <div className="bg-muted p-3 rounded-lg">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Мастер</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="font-medium text-sm break-words">
                  {object.foreman.firstName} {object.foreman.lastName}
                </p>
                {object.foreman.phone && (
                  <div className="flex items-center gap-1 text-sm ">
                    <Phone className="w-3 h-3 flex-shrink-0" />
                    <span className="break-all">{object.foreman.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Employee Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-xl font-bold">{object.employees.length}</div>
            <div className="text-xs text-blue-600 leading-tight">
              Всего сотрудников
            </div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-xl font-bold ">{object.employees.length}</div>
            <div className="text-xs text-green-600 leading-tight">На смене</div>
          </div>
        </div>

        {/* Current Shift Info */}
        <div className="flex-1 flex flex-col justify-end">
          {object ? (
            <div className="border border-primary bg-muted p-3 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <p className="font-medium  text-sm">Текущая смена</p>
                <Badge
                  variant="outline"
                  className=" border-primary text-xs w-fit"
                >
                  {"13 ч."}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="font-medium  text-sm">Общее кол-во часов</p>
                <Badge
                  variant="outline"
                  className=" border-primary text-xs w-fit"
                >
                  {"250 ч."}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="border border-gray-200 bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-gray-500 text-sm">Смена не активна</p>
              <p className="text-xs text-gray-400 mt-1 break-words">
                Последняя активность: {"вчера"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
