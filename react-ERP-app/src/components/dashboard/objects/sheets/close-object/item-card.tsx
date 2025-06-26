import { Card } from "@/components/ui/card";
import { RejectBadge } from "./reject-badge";
import { AcceptBadge } from "./accept-badge";
import { Button } from "@/components/ui/button";

type ItemCardtoCloseObjectProps = {
  category: string;
  quantity: number;
};

export function ItemCardtoCloseObject({
  category,
  quantity,
}: ItemCardtoCloseObjectProps) {
  return (
    <Card className="flex flex-row items-center justify-between p-3">
      <p className="text-[16px] w-[250px]">
        Категория: <span>{category}</span>
      </p>
      <p className="text-[16px] w-[140px]">
        Количество: <span>{quantity}</span>
      </p>
      <div className="flex gap-2 w-[175px]">
        <p className="text-[16px]">Статус:</p>
        {quantity !== 0 ? <RejectBadge /> : <AcceptBadge />}
      </div>
      <Button variant={"outline"} disabled={quantity === 0}>
        Открыть
      </Button>
    </Card>
  );
}
