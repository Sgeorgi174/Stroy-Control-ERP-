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
            <p className="text-sm text-muted-foreground">Наименование</p>
            <p className="font-medium">{clothesTransfer.clothes.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Сезон</p>
            <p className="font-medium">
              {clothesTransfer.clothes.season === "SUMMER" ? "Лето" : "Зима"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Размер</p>
            <p className="font-medium">
              {clothesTransfer.clothes.type === "CLOTHING"
                ? clothesTransfer.clothes.closthingSize.size
                : clothesTransfer.clothes.footwearSize.size}
            </p>
          </div>
          {clothesTransfer.clothes.type === "CLOTHING" && (
            <div>
              <p className="text-sm text-muted-foreground">Ростовка</p>
              <p className="font-medium">
                {clothesTransfer.clothes.clothingHeight.height}
              </p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">Количество</p>
            <p className="font-medium">{clothesTransfer.quantity}</p>
          </div>
        </div>

        <Separator />

        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Текущее место хранения
          </p>
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Building className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">
                {clothesTransfer.status !== "CONFIRM"
                  ? clothesTransfer.fromObject.name
                  : clothesTransfer.toObject.name}
              </span>
            </div>
            {clothesTransfer.fromObject.foreman &&
              clothesTransfer.toObject.foreman && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>
                      {clothesTransfer.status !== "CONFIRM"
                        ? `${clothesTransfer.fromObject.foreman.lastName} ${clothesTransfer.fromObject.foreman.firstName}`
                        : `${clothesTransfer.toObject.foreman.lastName} ${clothesTransfer.toObject.foreman.firstName}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>
                      {clothesTransfer.status !== "CONFIRM"
                        ? clothesTransfer.fromObject.foreman.phone
                        : clothesTransfer.toObject.foreman.phone}
                    </span>
                  </div>
                </div>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
