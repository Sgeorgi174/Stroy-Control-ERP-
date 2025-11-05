import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { splitAddress } from "@/lib/utils/splitAddress";
import type { Clothes } from "@/types/clothes";
import { Building, MapPin, Phone, User } from "lucide-react";

type ClothesDetailsBoxProps = { clothes: Clothes };

export function ClothesDetailsBox({ clothes }: ClothesDetailsBoxProps) {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 items-start gap-y-5 gap-x-4">
            <div className="col-span-1">
              <p className="text-sm text-muted-foreground">Кол-во</p>
              <div className="flex gap-2 items-center">
                <p className="font-medium">{clothes.quantity}</p>
              </div>
            </div>

            <div className="col-span-1">
              <p className="text-sm text-muted-foreground">Размер</p>
              <div className="flex gap-2 items-center">
                <p className="font-medium">
                  {clothes.type === "CLOTHING"
                    ? clothes.clothingSize.size
                    : clothes.footwearSize.size}
                </p>
              </div>
            </div>

            {clothes.type === "CLOTHING" && (
              <div className="col-span-1">
                <p className="text-sm text-muted-foreground">Ростовка</p>
                <div className="flex gap-2 items-center">
                  <p className="font-medium">{clothes.clothingHeight.height}</p>
                </div>
              </div>
            )}

            <div className="col-span-1">
              <p className="text-sm text-muted-foreground">Цена</p>
              <div className="flex gap-1 items-center">
                <p className="font-medium">{clothes.price} руб.</p>
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
                  {clothes.storage ? clothes.storage.name : "-"}
                </p>
              </div>
            </div>

            <div className="col-span-3">
              <p className="text-sm text-muted-foreground">Адрес</p>
              <div className="flex gap-2 items-center">
                <MapPin className="w-5 h-5" />
                <p className="font-medium">
                  {clothes.storage
                    ? `г. ${splitAddress(clothes.storage).city}, ул. ${
                        splitAddress(clothes.storage).street
                      }, ${splitAddress(clothes.storage).buldings}`
                    : "-"}
                </p>
              </div>
            </div>

            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Мастер</p>
              <div className="flex gap-2 items-center">
                <User className="w-5 h-5" />
                <p className="font-medium">
                  {clothes.storage && clothes.storage.foreman
                    ? `${clothes.storage.foreman?.lastName} ${clothes.storage.foreman?.firstName}`
                    : "Не назначен"}
                </p>
              </div>
            </div>

            <div className="col-span-3">
              <p className="text-sm text-muted-foreground">Телефон</p>
              <div className="flex gap-2 items-center">
                <Phone className="w-5 h-5" />
                <p className="font-medium">
                  {clothes.storage && clothes.storage.foreman
                    ? clothes.storage.foreman?.phone
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
