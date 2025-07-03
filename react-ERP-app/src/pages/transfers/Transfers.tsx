import { BootIcon } from "@/components/ui/boot";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetAllTransfers } from "@/hooks/user/useGetAllTRansfers";
import { formatDate } from "@/lib/utils/format-date";
import {
  ArrowRight,
  Clock,
  EllipsisVertical,
  MapPin,
  Minus,
  Package,
  Shirt,
} from "lucide-react";

export function Transfers() {
  const { data } = useGetAllTransfers();

  console.log(data);

  const transferStatusMap = {
    IN_TRANSIT: "Ждет подтверждения",
    REJECT: "Отклонено",
  };

  return (
    <div className="space-y-3 mt-6">
      {data?.tools.map((transfer) => (
        <Card
          key={transfer.id}
          className={`p-2 border-l-4 bg-sidebar-accent border-l-green-500 border-b-4 border-b-green-500`}
        >
          <CardContent className="p-4">
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Tool & Serial */}
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-primary truncate">
                    {transfer.tool.name}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    #{transfer.tool.serialNumber}
                  </p>
                </div>
              </div>

              {/* Transfer Route */}
              <div className="col-span-4 flex gap-3 items-center">
                <div className="flex items-center gap-1 min-w-0">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-sm text-primary truncate">
                    {transfer.fromObject.name}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Minus className="w-3 h-3 text-muted-foreground" />
                  <Minus className="w-3 h-3 text-muted-foreground" />
                  <Minus className="w-3 h-3 text-muted-foreground" />
                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-1 min-w-0 flex-1">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-sm text-primary truncate">
                    {transfer.toObject.name}
                  </span>
                </div>
              </div>

              {/* Date */}
              <div className="col-span-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatDate(transfer.createdAt)}
                </div>
              </div>

              {/* Status */}
              <div className="col-span-2 text-xs p-2 border border-amber-500 rounded-xl text-center">
                {transferStatusMap[transfer.status]}
              </div>

              {/* Actions */}
              <div className="col-span-1 flex justify-end">
                <Button variant="ghost">
                  <EllipsisVertical />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {data?.devices.map((transfer) => (
        <Card
          key={transfer.id}
          className={`p-2 border-l-4 bg-sidebar-accent border-l-green-500 border-b-4 border-b-green-500`}
        >
          <CardContent className="p-4">
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Tool & Serial */}
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-primary truncate">
                    {transfer.device.name}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    #{transfer.device.serialNumber}
                  </p>
                </div>
              </div>

              {/* Transfer Route */}
              <div className="col-span-4 flex gap-3 items-center">
                <div className="flex items-center gap-1 min-w-0">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-sm text-primary truncate">
                    {transfer.fromObject.name}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Minus className="w-3 h-3 text-muted-foreground" />
                  <Minus className="w-3 h-3 text-muted-foreground" />
                  <Minus className="w-3 h-3 text-muted-foreground" />
                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-1 min-w-0 flex-1">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-sm text-primary truncate">
                    {transfer.toObject.name}
                  </span>
                </div>
              </div>

              {/* Date */}
              <div className="col-span-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatDate(transfer.createdAt)}
                </div>
              </div>

              {/* Status */}
              <div className="col-span-2 text-xs p-2 border border-amber-500 rounded-xl text-center">
                {transferStatusMap[transfer.status]}
              </div>

              {/* Actions */}
              <div className="col-span-1 flex justify-end">
                <Button variant="ghost">
                  <EllipsisVertical />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {data?.clothes.map((transfer) => (
        <Card
          key={transfer.id}
          className={`p-2 border-l-4 bg-sidebar-accent border-l-green-500 border-b-4 border-b-green-500`}
        >
          <CardContent className="p-4">
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Tool & Serial */}
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                  {transfer.clothes.type === "FOOTWEAR" ? (
                    <BootIcon className="w-6 h-6 text-primary" />
                  ) : (
                    <Shirt className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-primary truncate">
                    {transfer.clothes.name}
                  </p>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground font-mono">
                      Размер: {transfer.clothes.size}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      Сезон:{" "}
                      {transfer.clothes.season === "SUMMER" ? "Лето" : "Зима"}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      Кол-во: {transfer.quantity}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transfer Route */}
              <div className="col-span-4 flex gap-3 items-center">
                <div className="flex items-center gap-1 min-w-0">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-sm text-primary truncate">
                    {transfer.fromObject.name}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Minus className="w-3 h-3 text-muted-foreground" />
                  <Minus className="w-3 h-3 text-muted-foreground" />
                  <Minus className="w-3 h-3 text-muted-foreground" />
                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-1 min-w-0 flex-1">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-sm text-primary truncate">
                    {transfer.toObject.name}
                  </span>
                </div>
              </div>

              {/* Date */}
              <div className="col-span-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatDate(transfer.createdAt)}
                </div>
              </div>

              {/* Status */}
              <div className="col-span-2 text-xs p-2 border border-amber-500 rounded-xl text-center">
                {transferStatusMap[transfer.status]}
              </div>

              {/* Actions */}
              <div className="col-span-1 flex justify-end">
                <Button variant="ghost">
                  <EllipsisVertical />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
