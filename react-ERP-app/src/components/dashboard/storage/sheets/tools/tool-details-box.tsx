import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { splitAddress } from "@/lib/utils/splitAddress";
import type { Tool } from "@/types/tool";
import { Building, MapPin, Phone, User } from "lucide-react";

type DetailsBoxProps = {
  tool: Tool;
};

export function ToolsDetailsBox({ tool }: DetailsBoxProps) {
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
                  {tool.storage ? tool.storage.name : "-"}
                </p>
              </div>
            </div>

            <div className="col-span-3">
              <p className="text-sm text-muted-foreground">Адрес</p>
              <div className="flex gap-2 items-center">
                <MapPin className="w-5 h-5" />
                <p className="font-medium">
                  {tool.storage
                    ? `г. ${splitAddress(tool.storage).city}, ул. ${
                        splitAddress(tool.storage).street
                      }, ${splitAddress(tool.storage).buldings}`
                    : "-"}
                </p>
              </div>
            </div>

            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Бригадир</p>
              <div className="flex gap-2 items-center">
                <User className="w-5 h-5" />
                <p className="font-medium">
                  {tool.storage
                    ? `${tool.storage.foreman?.lastName} ${tool.storage.foreman?.firstName}`
                    : "-"}
                </p>
              </div>
            </div>

            <div className="col-span-3">
              <p className="text-sm text-muted-foreground">Телефон</p>
              <div className="flex gap-2 items-center">
                <Phone className="w-5 h-5" />
                <p className="font-medium">
                  {tool.storage ? tool.storage.foreman?.phone : "-"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
