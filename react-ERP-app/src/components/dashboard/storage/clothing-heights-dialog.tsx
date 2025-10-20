import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import {
  useClothingHeights,
  useCreateClothingHeight,
  useDeleteClothingHeight,
} from "@/hooks/clothes/useClothes";

export function ClothingHeightsDialog() {
  const [open, setOpen] = useState(false);
  const [newHeight, setNewHeight] = useState("");

  const { data: heights = [], isLoading } = useClothingHeights();
  const createHeight = useCreateClothingHeight();
  const deleteHeight = useDeleteClothingHeight();

  const handleAdd = async () => {
    if (!newHeight.trim()) return;
    await createHeight.mutateAsync({ height: newHeight });
    setNewHeight("");
  };

  const handleDelete = async (id: string) => {
    await deleteHeight.mutateAsync(id);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          Ростовки одежды
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ростовки одежды</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              placeholder="Добавить новую ростовку..."
              value={newHeight}
              onChange={(e) => setNewHeight(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button
              onClick={handleAdd}
              disabled={createHeight.isPending || newHeight.length === 0}
            >
              Добавить
            </Button>
          </div>

          <div className="border rounded-md max-h-[300px] overflow-y-auto divide-y">
            {isLoading ? (
              <p className="p-4 text-sm text-muted-foreground">Загрузка...</p>
            ) : heights.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                Ростовок пока нет
              </p>
            ) : (
              heights.map((item: { id: string; height: string }) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center px-4 py-2 hover:bg-muted/50"
                >
                  <span>{item.height}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                    disabled={deleteHeight.isPending}
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
