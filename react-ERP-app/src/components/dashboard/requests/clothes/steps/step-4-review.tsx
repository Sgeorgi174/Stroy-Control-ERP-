// Step4Review.tsx
import type { CreateClothesRequestDto } from "@/types/dto/clothes-request.dto";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { User } from "@/types/user";
import type {
  ClosthingSize,
  FootwearSize,
  ClothingHeight,
} from "@/types/clothes";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  form: CreateClothesRequestDto;
  users: User[];
  clothesSizes: ClosthingSize[];
  footwearSizes: FootwearSize[];
  heights: ClothingHeight[];
};

export function Step4Review({
  form,
  users,
  clothesSizes,
  footwearSizes,
  heights,
}: Props) {
  const participants =
    form.participantsIds?.map((id) => users.find((u) => u.id === id)) || [];

  const totalItems =
    form.clothes?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900">
            Проверьте вашу заявку
          </p>
          <p className="text-sm text-blue-800 mt-1">
            Пожалуйста, проверьте информацию ниже перед созданием.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Название заявки
              </p>
              <p className="text-lg font-medium">{form.title}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Заказчик
              </p>
              <p className="text-lg font-medium">{form.customer}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Всего наименований
              </p>
              <p className="text-lg font-medium">{form.clothes?.length}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Итого кол-во
              </p>
              <p className="text-lg font-medium">{totalItems}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Участники
              </p>
              <div className="flex gap-2 flex-wrap max-h-40 overflow-y-auto">
                {participants.map(
                  (user) =>
                    user && (
                      <Badge
                        key={user.id}
                        variant="secondary"
                        className="text-[14px] px-4 py-1"
                      >
                        {user.lastName} {user.firstName}
                      </Badge>
                    ),
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Дата создания
              </p>
              <p className="text-lg font-medium">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          {form.clothes?.length ? (
            <div>
              <b>Позиции:</b>
              <Table className="mt-2">
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Наименование</TableHead>
                    <TableHead>Количество</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Сезон</TableHead>
                    <TableHead>Размер</TableHead>
                    <TableHead>Ростовка</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {form.clothes.map((item, index) => {
                    const clothingSize =
                      clothesSizes.find((s) => s.id === item.clothingSizeId)
                        ?.size || "-";
                    const footwearSize =
                      footwearSizes.find((s) => s.id === item.footwearSizeId)
                        ?.size || "-";
                    const height =
                      heights.find((h) => h.id === item.clothingHeightId)
                        ?.height || "-";

                    return (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          {item.type === "CLOTHING" ? "Одежда" : "Обувь"}
                        </TableCell>
                        <TableCell>
                          {item.season === "SUMMER" ? "Лето" : "Зима"}
                        </TableCell>

                        <TableCell>
                          {item.type === "CLOTHING"
                            ? clothingSize
                            : footwearSize}
                        </TableCell>
                        <TableCell>
                          {item.type === "CLOTHING" ? height : "-"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
