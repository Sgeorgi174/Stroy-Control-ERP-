import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  PendingClothesTransfer,
  PendingDeviceTransfer,
  PendingToolTransfer,
} from "@/types/transfers";
import { ArrowRight, MapPin, Minus } from "lucide-react";

type TransferRouteProps = {
  selectedTransfer:
    | PendingToolTransfer
    | PendingClothesTransfer
    | PendingDeviceTransfer;
};

export function TransferRoute({ selectedTransfer }: TransferRouteProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Маршрут
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-blue-500" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-medium">{selectedTransfer.fromObject.name}</p>
            </div>
          </div>
          <div className="flex text-muted-foreground">
            <Minus />
            <Minus />
            <ArrowRight />
          </div>
          <div className="flex items-center gap-2">
            <div className="">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-blue-500" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-medium">{selectedTransfer.toObject.name}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
