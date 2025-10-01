import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { splitAddress } from "@/lib/utils/splitAddress";
import type { Device } from "@/types/device";
import { Building, MapPin, Phone, User } from "lucide-react";

type DeviceDetailsBoxProps = { device: Device };

export function DeviceDetailsBox({ device }: DeviceDetailsBoxProps) {
  return (
    <>
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
                  {device.storage
                    ? `${device.storage.foreman?.lastName} ${device.storage.foreman?.firstName}`
                    : "-"}
                </p>
              </div>
            </div>

            <div className="col-span-3">
              <p className="text-sm text-muted-foreground">Телефон</p>
              <div className="flex gap-2 items-center">
                <Phone className="w-5 h-5" />
                <p className="font-medium">
                  {device.storage ? device.storage.foreman?.phone : "-"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
