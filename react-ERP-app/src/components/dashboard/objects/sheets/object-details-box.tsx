import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Object } from "@/types/object";
import { Building } from "lucide-react";

type ObjectDetailsBoxProps = { object: Object };

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function ObjectDetailsBox({ object }: ObjectDetailsBoxProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building className="w-5 h-5" />
            Информация об объекте
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Создан</p>
              <p className="font-medium">{formatDate(object.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Сотрудники</p>
              <p className="font-medium">{object.employees.length}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Мастер</p>
              <p className="font-medium">
                {object.foreman
                  ? `${object.foreman.lastName} ${object.foreman.firstName}`
                  : "Не назначен"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Телефон</p>
              <p className="font-medium">
                {object.foreman ? object.foreman.phone : "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
