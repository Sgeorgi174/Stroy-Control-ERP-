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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div>
          <b>Название:</b> {form.title}
        </div>
        <div>
          <b>Заказчик:</b> {form.customer}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <b>Участники:</b>
          {participants.map(
            (user) =>
              user && (
                <Badge key={user.id} variant="secondary">
                  {user.lastName} {user.firstName}
                </Badge>
              ),
          )}
        </div>
      </div>

      {form.clothes?.length ? (
        <div>
          <b>Позиции:</b>
          <Table className="mt-2">
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
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
                  heights.find((h) => h.id === item.clothingHeightId)?.height ||
                  "-";

                return (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {item.type === "CLOTHING" ? "Одежда" : "Обувь"}
                    </TableCell>
                    <TableCell>
                      {item.season === "SUMMER" ? "Лето" : "Зима"}
                    </TableCell>

                    <TableCell>
                      {item.type === "CLOTHING" ? clothingSize : footwearSize}
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
    </div>
  );
}
