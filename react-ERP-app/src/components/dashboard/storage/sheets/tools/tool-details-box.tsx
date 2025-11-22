import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
              <p className="text-sm text-muted-foreground">Мастер</p>
              <div className="flex gap-2 items-center">
                <User className="w-5 h-5" />
                <p className="font-medium">
                  {tool.storage && tool.storage.foreman
                    ? `${tool.storage.foreman?.lastName} ${tool.storage.foreman?.firstName}`
                    : "Не назначен"}
                </p>
              </div>
            </div>

            <div className="col-span-3">
              <p className="text-sm text-muted-foreground">Телефон</p>
              <div className="flex gap-2 items-center">
                <Phone className="w-5 h-5" />
                <p className="font-medium">
                  {tool.storage && tool.storage.foreman
                    ? tool.storage.foreman?.phone
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {tool.isBag && (
        <Card className="mt-3">
          <CardHeader>
            <CardTitle className="text-lg">Наполнение сумки</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Инструмент</TableHead>
                  <TableHead>Количество</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tool.bagItems ? (
                  tool.bagItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {`${item.name}`}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center p-4 text-gray-400"
                    >
                      Сумка пуста
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
}
