import { useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Warehouse } from "lucide-react";

// Components
import { StorageSelect } from "./storage-select";
import { EmptyState } from "./empty-state";
import { ItemsTable } from "./item-table";
import { CreateStorageSheet } from "./create-storage-sheet";
import { CreateItemSheet } from "./create-item-sheet";
import { ItemDetailsSheet } from "./item-details-sheet";
import { RestockItemSheet } from "./restock-item-sheet";
import { SendItemSheet } from "./send-item-sheet";

// Hooks
import {
  useAdditionalStorages,
  useCreateAdditionalStorage,
} from "@/hooks/additional-storage/useAdditionalStorage";

import {
  useSentItems,
  useCreateSentItem,
  useSentItemHistory,
  useAddSentItemQuantity,
  useRemoveSentItemQuantity,
} from "@/hooks/additional-storage/useSentItems";

import type { SentItem } from "@/types/sent-item";
import { Input } from "@/components/ui/input";

export function AdditionalStoragePage() {
  // ===== STATE =====
  const [storageId, setStorageId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<SentItem | null>(null);
  const [createStorageOpen, setCreateStorageOpen] = useState(false);
  const [createItemOpen, setCreateItemOpen] = useState(false);
  const [restockItem, setRestockItem] = useState<SentItem | null>(null);
  const [sendItem, setSendItem] = useState<SentItem | null>(null);
  const [itemSearch, setItemSearch] = useState("");

  // STORAGE form
  const [newStorageName, setNewStorageName] = useState("");

  // ITEM form
  const [itemFormData, setItemFormData] = useState({
    name: "",
    quantity: 0,
    price: 0,
    description: "",
    enterpriser: "",
  });

  // ===== HOOKS =====
  const { data: storages, isLoading: storagesLoading } =
    useAdditionalStorages();
  const createStorage = useCreateAdditionalStorage();

  const { data: items, isLoading: itemsLoading } = useSentItems();
  const createItem = useCreateSentItem();
  const historyData = useSentItemHistory(selectedItem?.id ?? "");

  // Мутации для пополнения и списания
  const restockMutation = useAddSentItemQuantity(restockItem?.id ?? "");
  const sendMutation = useRemoveSentItemQuantity(sendItem?.id ?? "");

  // ===== MEMO & FILTERS =====
  const filteredItems = useMemo(() => {
    if (!storageId || !items) return [];
    return items
      .filter((i) => i.additionalStorageId === storageId)
      .filter((i) => i.name.toLowerCase().includes(itemSearch.toLowerCase()));
  }, [items, storageId, itemSearch]);

  // ===== HANDLERS =====
  const handleCreateStorage = useCallback(async () => {
    if (!newStorageName.trim()) return;
    await createStorage.mutateAsync({ name: newStorageName });
    setNewStorageName("");
    setCreateStorageOpen(false);
  }, [newStorageName, createStorage]);

  const handleCreateItem = useCallback(
    async (selectedDate: Date) => {
      // ← получаем дату из Sheet
      if (!storageId || !itemFormData.name.trim()) return;
      await createItem.mutateAsync({
        name: itemFormData.name,
        quantity: itemFormData.quantity,
        price: itemFormData.price,
        description: itemFormData.description,
        addedDay: selectedDate.toISOString(), // ← используем выбранную дату
        additionalStorageId: storageId,
      });
      setItemFormData({
        name: "",
        quantity: 0,
        price: 0,
        description: "",
        enterpriser: "",
      });
      setCreateItemOpen(false);
    },
    [storageId, itemFormData, createItem],
  );
  const handleItemFormChange = useCallback(
    (data: Partial<typeof itemFormData>) => {
      setItemFormData((prev) => ({ ...prev, ...data }));
    },
    [],
  );

  const handleItemAction = useCallback(
    (item: SentItem, action: "view" | "edit" | "restock" | "send") => {
      switch (action) {
        case "view":
          setSelectedItem(item);
          break;
        case "edit":
          console.log("Редактирование:", item);
          break;
        case "restock":
          setRestockItem(item);
          break;
        case "send":
          setSendItem(item);
          break;
      }
    },
    [],
  );

  const handleRestock = useCallback(
    async (data: {
      itemId: string;
      quantity: number;
      comment: string;
      date: Date;
    }) => {
      if (!restockItem) return;
      await restockMutation.mutateAsync({
        quantity: data.quantity,
        comment: data.comment,
        actionDate: data.date.toISOString(), // <-- конвертация в string
      });
      setRestockItem(null);
    },
    [restockItem, restockMutation],
  );

  const handleSend = useCallback(
    async (data: {
      itemId: string;
      quantity: number;
      comment: string;
      date: Date;
    }) => {
      if (!sendItem) return;
      await sendMutation.mutateAsync({
        quantity: data.quantity,
        comment: data.comment,
        actionDate: data.date.toISOString(), // <-- конвертация в string
      });
      setSendItem(null);
    },
    [sendItem, sendMutation],
  );

  // ===== RENDER =====
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-6">
        <StorageSelect
          storages={storages}
          isLoading={storagesLoading}
          value={storageId}
          onValueChange={setStorageId}
        />

        <div className="flex items-center gap-2 sm:ml-auto">
          {storageId && (
            <Input
              placeholder="Поиск ..."
              value={itemSearch}
              onChange={(e) => setItemSearch(e.target.value)}
              className="w-[400px]"
            />
          )}
          <Button
            variant="outline"
            onClick={() => setCreateStorageOpen(true)}
            className="gap-2"
          >
            <Warehouse className="h-4 w-4" />
            Новый склад
          </Button>

          {storageId && (
            <Button onClick={() => setCreateItemOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Добавить товар
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {!storageId ? (
        <EmptyState />
      ) : (
        <ItemsTable
          items={filteredItems}
          isLoading={itemsLoading}
          onItemAction={handleItemAction}
        />
      )}

      {/* Sheets */}
      <CreateStorageSheet
        open={createStorageOpen}
        onOpenChange={setCreateStorageOpen}
        name={newStorageName}
        onNameChange={setNewStorageName}
        onSubmit={handleCreateStorage}
        isLoading={createStorage.isPending}
      />

      <CreateItemSheet
        open={createItemOpen}
        onOpenChange={setCreateItemOpen}
        formData={itemFormData}
        onFormChange={handleItemFormChange}
        onSubmit={handleCreateItem} // ← теперь handleCreateItem получает дату
        isLoading={createItem.isPending}
      />

      <ItemDetailsSheet
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        history={historyData.data}
        isHistoryLoading={historyData.isLoading}
      />

      <RestockItemSheet
        item={restockItem}
        open={!!restockItem}
        onOpenChange={(open) => !open && setRestockItem(null)}
        onSubmit={handleRestock}
        isLoading={restockMutation.isPending}
      />

      <SendItemSheet
        item={sendItem}
        open={!!sendItem}
        onOpenChange={(open) => !open && setSendItem(null)}
        onSubmit={handleSend}
        isLoading={sendMutation.isPending}
      />
    </div>
  );
}
