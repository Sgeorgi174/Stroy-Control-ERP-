import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit2, Check, X } from "lucide-react";
import { useState } from "react";
import {
  useCreateProvider,
  useDeleteProvider,
  useProviders,
  useUpdateProvider,
} from "@/hooks/clothes/useClothes";

export function ProvidersDialog() {
  const [open, setOpen] = useState(false);
  const [newProvider, setNewProvider] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const { data: providers = [], isLoading } = useProviders();
  const createProvider = useCreateProvider();
  const deleteProvider = useDeleteProvider();
  const updateProviderMutation = useUpdateProvider(editingId || "");

  const handleAdd = async () => {
    if (!newProvider.trim()) return;
    await createProvider.mutateAsync({ name: newProvider });
    setNewProvider("");
  };

  const handleEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleUpdate = async () => {
    if (!editingName.trim() || !editingId) return;
    await updateProviderMutation.mutateAsync({ name: editingName });
    setEditingId(null);
    setEditingName("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleDelete = async (id: string) => {
    await deleteProvider.mutateAsync(id);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          Поставщики
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Поставщики</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Добавление нового поставщика */}
          <div className="flex gap-2">
            <Input
              placeholder="Добавить нового поставщика..."
              value={newProvider}
              onChange={(e) => setNewProvider(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button onClick={handleAdd} disabled={createProvider.isPending}>
              Добавить
            </Button>
          </div>

          {/* Список существующих поставщиков */}
          <div className="border rounded-md max-h-[400px] overflow-y-auto divide-y">
            {isLoading ? (
              <p className="p-4 text-sm text-muted-foreground">Загрузка...</p>
            ) : providers.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                Поставщиков пока нет
              </p>
            ) : (
              providers.map((provider: { id: string; name: string }) => (
                <div
                  key={provider.id}
                  className="flex justify-between items-center px-4 py-2 hover:bg-muted/50"
                >
                  {editingId === provider.id ? (
                    <div className="flex gap-2 w-full">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1"
                        onKeyDown={(e) =>
                          e.key === "Enter" ? handleUpdate() : null
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleUpdate}
                      >
                        <Check className="h-4 w-4 text-success" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="truncate">{provider.name}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(provider.id, provider.name)}
                        >
                          <Edit2 className="h-4 w-4 text-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(provider.id)}
                          disabled={deleteProvider.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
