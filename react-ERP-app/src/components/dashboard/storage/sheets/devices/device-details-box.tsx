import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/format-date";
import { splitAddress } from "@/lib/utils/splitAddress";
import type { Device } from "@/types/device";
import { Building, Calendar, Hash, MapPin, Phone, User } from "lucide-react";

type DeviceDetailsBoxProps = { device: Device };

export function DeviceDetailsBox({ device }: DeviceDetailsBoxProps) {
  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-5 items-start gap-y-5 gap-x-4">
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Дата добавления</p>
              <div className="flex gap-2 items-center">
                <Calendar className="w-5 h-5" />
                <p className="font-medium">{formatDate(device.createdAt)}</p>
              </div>
            </div>

            <div className="col-span-3">
              <p className="text-sm text-muted-foreground">{"Инвентарый №"}</p>
              <div className="flex gap-2 items-center">
                <Hash className="w-5 h-5" />
                <p className="font-medium">{device.serialNumber}</p>
              </div>
            </div>

            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Серийный №</p>
              <div className="flex gap-2 items-center">
                <Hash className="w-5 h-5" />
                <p className="font-medium">
                  {device.originalSerial ? device.originalSerial : "Не указан"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Место хранения</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-5 items-start gap-y-5 gap-x-4">
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Объект</p>
              <div className="flex gap-2 items-center">
                <Building className="w-5 h-5" />
                <p className="font-medium">
                  {device.storage ? device.storage.name : "-"}
                </p>
              </div>
            </div>

            <div className="col-span-3">
              <p className="text-sm text-muted-foreground">Адрес</p>
              <div className="flex gap-2 items-center">
                <MapPin className="w-5 h-5" />
                <p className="font-medium">
                  {device.storage
                    ? `г. ${splitAddress(device.storage).city}, ул. ${
                        splitAddress(device.storage).street
                      }, ${splitAddress(device.storage).buldings}`
                    : "-"}
                </p>
              </div>
            </div>

            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Мастер</p>
              <div className="flex gap-2 items-center">
                <User className="w-5 h-5" />
                <p className="font-medium">
                  {device.storage && device.storage.foreman
                    ? `${device.storage.foreman?.lastName} ${device.storage.foreman?.firstName}`
                    : "Не назначен"}
                </p>
              </div>
            </div>

            <div className="col-span-3">
              <p className="text-sm text-muted-foreground">Телефон</p>
              <div className="flex gap-2 items-center">
                <Phone className="w-5 h-5" />
                <p className="font-medium">
                  {device.storage && device.storage.foreman
                    ? device.storage.foreman?.phone
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
