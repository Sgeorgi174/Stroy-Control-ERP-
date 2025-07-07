import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { PendingClothesTransfer } from "@/types/transfers";
import { Building, Package, Phone, User } from "lucide-react";

type ClothesTransferDetailsProps = {
  clothesTransfer: PendingClothesTransfer;
};

export function ClothesTransferDetails({
  clothesTransfer,
}: ClothesTransferDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Package className="w-5 h-5" />
          Информация об{" "}
          {clothesTransfer.clothes.type === "CLOTHING" ? "одежде" : "обуви"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Наименование</p>
            <p className="font-medium">{clothesTransfer.clothes.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Сезон</p>
            <p className="font-mono text-sm">
              {clothesTransfer.clothes.season}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Размер</p>
            <p className="font-mono text-sm">
              {clothesTransfer.clothes.season}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Количество</p>
            <p className="font-mono text-sm">{clothesTransfer.quantity}</p>
          </div>
        </div>

        <Separator />

        <div>
          <p className="text-sm text-gray-500 mb-2">Текущее место хранения</p>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Building className="w-4 h-4 text-gray-600" />
              <span className="font-medium">
                {clothesTransfer.fromObject.name}
              </span>
            </div>
            {clothesTransfer.fromObject.foreman && (
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>
                    {clothesTransfer.fromObject.foreman.lastName}{" "}
                    {clothesTransfer.fromObject.foreman.firstName}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{clothesTransfer.fromObject.foreman.phone}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
