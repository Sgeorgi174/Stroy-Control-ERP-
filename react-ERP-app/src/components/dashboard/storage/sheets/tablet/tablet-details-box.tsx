import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tablet } from "@/types/tablet";
import { Contact, Phone, User } from "lucide-react";

type TabletDetailsProps = {
  tablet: Tablet;
};

export function TabletDetailsBox({ tablet }: TabletDetailsProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Пользователь</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 items-start gap-y-5 gap-x-4">
            <div className="col-span-1">
              <p className="text-sm text-muted-foreground">Сотрудник</p>
              <div className="flex gap-2 items-center">
                <User className="w-5 h-5" />
                <p className="font-medium">
                  {tablet.employee
                    ? `${tablet.employee.lastName} ${tablet.employee.firstName}`
                    : "-"}
                </p>
              </div>
            </div>

            <div className="col-span-1">
              <p className="text-sm text-muted-foreground">Должность</p>
              <div className="flex gap-2 items-center">
                <Contact className="w-5 h-5" />
                <p className="font-medium">
                  {tablet.employee ? tablet.employee.position : "-"}
                </p>
              </div>
            </div>

            <div className="col-span-1">
              <p className="text-sm text-muted-foreground">Телефон</p>
              <div className="flex gap-2 items-center">
                <Phone className="w-5 h-5" />
                <p className="font-medium">
                  {tablet.employee ? tablet.employee.phoneNumber : "-"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
