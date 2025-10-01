import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAddToolBagItem } from "@/hooks/tool/useAddToolBagItem";
import { useGetToolById } from "@/hooks/tool/useGetToolById";
import type { Tool } from "@/types/tool";
import { Plus, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { useRemoveToolBagItem } from "@/hooks/tool/useRemoveToolBagItem";

type ToolBagEditProps = {
  tool: Tool;
};

export function ToolBagEdit({ tool }: ToolBagEditProps) {
  const [formData, setFormData] = useState({ name: "", quantity: "" });
  const addItemMutation = useAddToolBagItem(tool.id);
  const { data: toolBag } = useGetToolById(tool.id);

  // диалог удаления
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    name: string;
    quantity: number;
  } | null>(null);
  const [removeQuantity, setRemoveQuantity] = useState("");

  // при выборе элемента предзаполняем поле количеством
  useEffect(() => {
    if (open && selectedItem) {
      setRemoveQuantity(String(selectedItem.quantity));
    }
  }, [open, selectedItem]);

  const handleAdd = () => {
    addItemMutation.mutate(
      {
        name: formData.name.trim(),
        quantity: Number(formData.quantity),
      },
      {
        onSuccess: () => {
          setFormData({ name: "", quantity: "" });
        },
      }
    );
  };

  const openRemoveDialog = (item: {
    id: string;
    name: string;
    quantity: number;
  }) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const removeItemMutation = useRemoveToolBagItem(
    selectedItem ? selectedItem.id : ""
  );

  const handleRemove = () => {
    if (!selectedItem || !removeItemMutation) return;
    const qty = Number(removeQuantity);
    if (!qty || qty <= 0 || qty > selectedItem.quantity) return;

    removeItemMutation.mutate(
      { quantity: qty },
      {
        onSuccess: () => {
          setOpen(false);
          setSelectedItem(null);
          setRemoveQuantity("");
        },
      }
    );
  };

  return (
    <div className="p-5">
      <Card className="mt-3">
        <CardHeader>
          <CardTitle className="text-lg">Редактирование сумки</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-7">
            <div className="flex flex-col gap-2 w-[400px]">
              <Label htmlFor="name">Наименование *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="quantity">Кол-во *</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
              />
            </div>
          </div>

          <div className="w-full flex justify-end">
            <Button
              onClick={handleAdd}
              className="mt-5"
              disabled={
                addItemMutation.isPending ||
                formData.name === "" ||
                Number(formData.quantity) <= 0
              }
            >
              <Plus />
              Добавить инструмент в сумку
            </Button>
          </div>

          <Table className="mt-8">
            <TableHeader>
              <TableRow>
                <TableHead>Инструмент</TableHead>
                <TableHead>Количество</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {toolBag && toolBag.bagItems.length > 0 ? (
                toolBag.bagItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      <Trash
                        className="w-4 h-4 cursor-pointer text-red-500"
                        onClick={() => openRemoveDialog(item)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center p-4 text-gray-400"
                  >
                    Сумка пуста
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Диалог удаления */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить {selectedItem?.name} из сумки</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Label htmlFor="removeQuantity">
              Укажите количество (максимум: {selectedItem?.quantity ?? 0})
            </Label>
            <Input
              id="removeQuantity"
              type="number"
              min={1}
              max={selectedItem?.quantity ?? undefined}
              value={removeQuantity}
              onChange={(e) => setRemoveQuantity(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemove}
              disabled={
                removeItemMutation?.isPending ||
                Number(removeQuantity) <= 0 ||
                Number(removeQuantity) > (selectedItem?.quantity ?? 0)
              }
            >
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
