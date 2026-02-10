import { Card, CardContent } from "@/components/ui/card";
import { Warehouse } from "lucide-react";

export function EmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-20">
        <div className="rounded-full bg-muted p-5 mb-4">
          <Warehouse className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-1">Выберите склад</h3>
        <p className="text-muted-foreground text-center max-w-sm">
          Выберите склад из списка выше для просмотра и управления товарами
        </p>
      </CardContent>
    </Card>
  );
}
