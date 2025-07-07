import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTransferSheetStore } from "@/stores/transfer-sheet-store";
import { ToolTransferDetails } from "./tool-transfer-details";
import { DeviceTransferDetails } from "./device-transfer-details";
import { ClothesTransferDetails } from "./clothes-transfer-details";
import type {
  PendingClothesTransfer,
  PendingDeviceTransfer,
  PendingToolTransfer,
} from "@/types/transfers";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  RotateCcw,
  Trash2,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { transferStatusMap } from "@/constants/transfer-status-map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { baseUrl } from "@/constants/baseUrl";

export function TransferSheet() {
  const { isOpen, selectedTransfer, type, closeSheet } =
    useTransferSheetStore();
  if (!selectedTransfer) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "IN_TRANSIT":
        return "bg-blue-100 text-blue-800";
      case "CONFIRM":
        return "bg-green-100 text-green-800";
      case "REJECT":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "IN_TRANSIT":
        return <Package className="w-4 h-4" />;
      case "CONFIRM":
        return <CheckCircle className="w-4 h-4" />;
      case "REJECT":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent className="overflow-y-auto w-full sm:max-w-xl">
        <SheetHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <SheetTitle className="text-xl">Детали перемещнеия</SheetTitle>
              <SheetDescription>
                ID перемещения: {selectedTransfer.id}
              </SheetDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              className={`${getStatusColor(
                selectedTransfer.status
              )} flex items-center gap-1`}
            >
              {getStatusIcon(selectedTransfer.status)}
              {transferStatusMap[selectedTransfer.status]}
            </Badge>
          </div>
        </SheetHeader>
        <div className="space-y-6 mt-3 px-3">
          {type === "tool" && (
            <ToolTransferDetails
              toolTransfer={selectedTransfer as PendingToolTransfer}
            />
          )}
          {type === "device" && (
            <DeviceTransferDetails
              deviceTransfer={selectedTransfer as PendingDeviceTransfer}
            />
          )}
          {type === "clothes" && (
            <ClothesTransferDetails
              clothesTransfer={selectedTransfer as PendingClothesTransfer}
            />
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Маршрут
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Из</p>
                  <p className="font-medium">
                    {selectedTransfer.fromObject.name}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">На</p>
                  <p className="font-medium">
                    {selectedTransfer.toObject.name}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedTransfer.status === "REJECT" && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  Детали отказа
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTransfer.rejectionComment && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Причина отказа</p>
                    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                      <p className="text-sm">
                        {selectedTransfer.rejectionComment}
                      </p>
                    </div>
                  </div>
                )}

                {selectedTransfer.photoUrl && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Фото</p>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <img
                        src={
                          `${baseUrl}${selectedTransfer.photoUrl}` ||
                          "/placeholder.svg"
                        }
                        alt="Rejection evidence"
                        className="max-w-full h-auto rounded-md"
                      />
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-3">
                  <p className="font-medium text-gray-900">Возможные Решения</p>
                  <div className="grid gap-2">
                    <Button className="w-full justify-start">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Перемещение
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full justify-start"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Списать
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Вернуть на объект отправитель
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedTransfer.status === "IN_TRANSIT" && (
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
                  <Package className="w-5 h-5" />
                  Перемещение в пути
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                  <p className="text-sm text-blue-800">
                    Перемещение в процессе. Инвентарь был отправлен с{" "}
                    {selectedTransfer.fromObject.name} на{" "}
                    {selectedTransfer.toObject.name}.
                  </p>
                </div>

                <Button variant="destructive" className="w-full">
                  <XCircle className="w-4 h-4 mr-2" />
                  Отменить перемещение
                </Button>
              </CardContent>
            </Card>
          )}

          {selectedTransfer.status === "CONFIRM" && (
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  Перемещение выполнено
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    Перемещение успешно выполнено. Инвентарь был перемещен на
                    объект {selectedTransfer.toObject.name} и принят бригадиром.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
