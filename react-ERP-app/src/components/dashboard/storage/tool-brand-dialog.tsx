import { useState } from "react";
import { Trash2, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useCreateToolBrand,
  useDeleteToolBrand,
  useToolBrands,
} from "@/hooks/tool/useToolBrand";

export function ToolBrandsDialog() {
  const [open, setOpen] = useState(false);
  const [newBrand, setNewBrand] = useState("");

  const { data: brands = [], isLoading } = useToolBrands();
  const createBrand = useCreateToolBrand();
  const deleteBrand = useDeleteToolBrand();

  const handleAdd = async () => {
    if (!newBrand.trim()) return;
    await createBrand.mutateAsync({ name: newBrand });
    setNewBrand("");
  };

  const handleDelete = async (id: string) => {
    if (
      confirm(
        "Вы уверены? Если к бренду привязаны инструменты, удаление будет невозможно.",
      )
    ) {
      await deleteBrand.mutateAsync(id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Tag className="h-4 w-4" />
          Марки инструмента
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Справочник брендов</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Поле добавления */}
          <div className="flex gap-2">
            <Input
              placeholder="Напр: Makita, Bosch, Hilti..."
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button onClick={handleAdd} disabled={createBrand.isPending}>
              Добавить
            </Button>
          </div>

          {/* Список */}
          <div className="border rounded-md max-h-[400px] overflow-y-auto divide-y">
            {isLoading ? (
              <p className="p-4 text-sm text-muted-foreground text-center">
                Загрузка...
              </p>
            ) : brands.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground text-center">
                Список пуст. Добавьте первую марку.
              </p>
            ) : (
              brands.map((brand) => (
                <div
                  key={brand.id}
                  className="flex justify-between items-center px-4 py-2 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{brand.name}</span>
                    {brand._count && (
                      <span className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                        {brand._count.tools} шт.
                      </span>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(brand.id)}
                      disabled={deleteBrand.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
