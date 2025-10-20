"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import {
  useClothingSizes,
  useCreateClothingSize,
  useDeleteClothingSize,
} from "@/hooks/clothes/useClothes";

export function ClothingSizesDialog() {
  const [open, setOpen] = useState(false);
  const [newSize, setNewSize] = useState("");

  const { data: sizes = [], isLoading } = useClothingSizes();
  const createSize = useCreateClothingSize();
  const deleteSize = useDeleteClothingSize();

  const handleAdd = async () => {
    if (!newSize.trim()) return;
    await createSize.mutateAsync({ size: newSize });
    setNewSize("");
  };

  const handleDelete = async (id: string) => {
    await deleteSize.mutateAsync(id);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          Размеры одежды
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Размеры одежды</DialogTitle>
          <DialogDescription>Настройка размеров одежды</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-6">
          <div className="flex gap-2">
            <Input
              placeholder="Добавить новый размер..."
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button
              onClick={handleAdd}
              disabled={createSize.isPending || newSize.length === 0}
            >
              Добавить
            </Button>
          </div>

          <div className="border rounded-md max-h-[300px] overflow-y-auto divide-y">
            {isLoading ? (
              <p className="p-4 text-sm text-muted-foreground">Загрузка...</p>
            ) : sizes.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                Размеров пока нет
              </p>
            ) : (
              sizes.map((item: { id: string; size: string }) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center px-4 py-2 hover:bg-muted/50"
                >
                  <span>{item.size}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                    disabled={deleteSize.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
