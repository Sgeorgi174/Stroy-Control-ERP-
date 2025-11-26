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
  useCreateCustomer,
  useCustomers,
  useDeleteCustomer,
  useUpdateCustomer,
} from "@/hooks/object/useCustomers";
import type { Customer } from "@/types/object";

export function CustomersDialog() {
  const [open, setOpen] = useState(false);

  // Добавление
  const [newName, setNewName] = useState("");
  const [newShortName, setNewShortName] = useState("");

  // Редактирование
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingShortName, setEditingShortName] = useState("");

  const { data: customers = [], isLoading } = useCustomers();
  const createCustomer = useCreateCustomer();
  const deleteCustomer = useDeleteCustomer();
  const updateCustomerMutation = useUpdateCustomer(editingId || "");

  // Добавление нового заказчика
  const handleAdd = async () => {
    if (!newName.trim()) return;

    await createCustomer.mutateAsync({
      name: newName,
      shortName: newShortName || null,
    });

    setNewName("");
    setNewShortName("");
  };

  // Начать редактирование
  const handleEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setEditingName(customer.name);
    setEditingShortName(customer.shortName ?? "");
  };

  // Сохранить изменения
  const handleUpdate = async () => {
    if (!editingName.trim() || !editingId) return;

    await updateCustomerMutation.mutateAsync({
      name: editingName,
      shortName: editingShortName || null,
    });

    setEditingId(null);
    setEditingName("");
    setEditingShortName("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
    setEditingShortName("");
  };

  const handleDelete = async (id: string) => {
    await deleteCustomer.mutateAsync(id);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          Заказчики
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Заказчики</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Добавление нового заказчика */}
          <div className="flex gap-2">
            <Input
              placeholder="Название"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Короткое имя (необязательно)"
              value={newShortName}
              onChange={(e) => setNewShortName(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleAdd}
              disabled={createCustomer.isPending || !newName.trim()}
            >
              Добавить
            </Button>
          </div>

          {/* Список заказчиков */}
          <div className="border rounded-md max-h-[400px] overflow-y-auto divide-y">
            {isLoading ? (
              <p className="p-4 text-sm text-muted-foreground">Загрузка...</p>
            ) : customers.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                Заказчиков пока нет
              </p>
            ) : (
              customers.map((customer: Customer) => (
                <div
                  key={customer.id}
                  className="flex justify-between items-center px-4 py-2 hover:bg-muted/50"
                >
                  {editingId === customer.id ? (
                    <div className="flex gap-2 w-full">
                      <Input
                        value={editingName}
                        placeholder="Название"
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        value={editingShortName}
                        placeholder="Короткое имя"
                        onChange={(e) => setEditingShortName(e.target.value)}
                        className="flex-1"
                      />

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleUpdate}
                      >
                        <Check className="h-4 w-4 text-green-600" />
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
                      <div className="flex flex-col flex-1">
                        <span className="font-medium">{customer.name}</span>
                        {customer.shortName && (
                          <span className="text-sm text-muted-foreground">
                            {customer.shortName}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(customer)}
                        >
                          <Edit2 className="h-4 w-4 text-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(customer.id)}
                          disabled={deleteCustomer.isPending}
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
