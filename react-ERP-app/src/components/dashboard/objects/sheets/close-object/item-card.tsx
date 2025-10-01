import { Card } from "@/components/ui/card";
import { RejectBadge } from "./reject-badge";
import { AcceptBadge } from "./accept-badge";

type ItemCardtoCloseObjectProps = {
  category: string;
  quantity: number | undefined;
  handleClick: () => void;
};

export function ItemCardtoCloseObject({
  category,
  quantity,
  handleClick,
}: ItemCardtoCloseObjectProps) {
  return (
    <Card
      onClick={handleClick}
      className="flex flex-row items-center justify-between p-3 cursor-pointer hover:shadow-md"
    >
      <p className="text-[16px] w-[250px]">
        Категория: <span>{category}</span>
      </p>
      <p className="text-[16px] w-[140px]">
        Количество: <span>{quantity ? quantity : 0}</span>
      </p>
      <div className="flex gap-2 w-[175px]">
        <p className="text-[16px]">Статус:</p>
        {quantity !== 0 ? <RejectBadge /> : <AcceptBadge />}
      </div>
    </Card>
  );
}
