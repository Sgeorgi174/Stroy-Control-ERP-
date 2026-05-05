import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, X, Search, Check, Loader2 } from "lucide-react";
import { useTools } from "@/hooks/tool/useTools";
import { useDevices } from "@/hooks/device/useDevices";
import type { ObjectDocType, ObjectDocument } from "@/types/object-document";
import {
  useCreateObjectDocument,
  useDeleteObjectDocument,
  useObjectDocuments,
  useUpdateObjectDocument,
} from "@/hooks/object-document/useObjectDocuments";
import { DocumentDropZone } from "./doc-box/document-drop-zone";
import { DocumentCard } from "./doc-box/document-card";
import type { Tool } from "@/types/tool";
import type { Device } from "@/types/device";
import { DOC_TYPE_LABELS } from "./doc-box/object-document-conts";
import { useDebouncedState } from "@/hooks/useDebounceState";
import { DescriptionPopover } from "../../storage/description-popover";

type FilterType = ObjectDocType;

interface InventoryItem {
  id: string;
  name: string;
  type: "tool" | "device";
}

export function ObjectDocumentsBox({ objectId }: { objectId: string }) {
  const [open, setOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<ObjectDocument | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<FilterType>("IMPORT");
  const [documentSearchQuery, setDocumentSearchQuery] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [docType, setDocType] = useState<ObjectDocType>("IMPORT");
  const [inventoryType, setInventoryType] = useState<"tool" | "device">("tool");
  const [searchQuery, setSearchQuery, debouncedSearchQuery] = useDebouncedState(
    "",
    500,
  );
  const [selectedItems, setSelectedItems] = useState<InventoryItem[]>([]);

  const { data: documents = [], isLoading: isDocsLoading } = useObjectDocuments(
    objectId,
    {},
  );
  const createMutation = useCreateObjectDocument(objectId);
  const updateMutation = useUpdateObjectDocument(objectId);
  const deleteMutation = useDeleteObjectDocument(objectId);

  const { data: toolsData } = useTools(
    { searchQuery: debouncedSearchQuery, isBulk: false },
    inventoryType === "tool" && !!searchQuery,
  );
  const { data: devicesData } = useDevices(
    { searchQuery: debouncedSearchQuery },
    inventoryType === "device" && !!searchQuery,
  );

  const itemsList = useMemo(() => {
    // Используем debounced значение, чтобы список отрисовывался
    // только когда данные от API загрузятся под этот запрос
    if (!debouncedSearchQuery.trim()) return [];

    return inventoryType === "tool"
      ? (toolsData || []).map((t: Tool) => ({ ...t, type: "tool" as const }))
      : (devicesData || []).map((d: Device) => ({
          ...d,
          type: "device" as const,
        }));
  }, [inventoryType, debouncedSearchQuery, toolsData, devicesData]);

  const resetForm = useCallback(() => {
    setFile(null);
    setName("");
    setComment("");
    setDocType("IMPORT");
    setEditingDoc(null);
    setSelectedItems([]);
    setSearchQuery(""); // Это сбросит и локальное, и debounced состояние
  }, [setSearchQuery]);

  const handleEdit = (doc: ObjectDocument) => {
    setEditingDoc(doc);
    setName(doc.name);
    setComment(doc.comment || "");
    setDocType(doc.type);
    setSelectedItems([
      ...(doc.tools || []).map((t) => ({ ...t, type: "tool" as const })),
      ...(doc.devices || []).map((d) => ({ ...d, type: "device" as const })),
    ]);
    setOpen(true);
  };

  const handleSave = async () => {
    // Формируем списки ID явно
    const toolIds = selectedItems
      .filter((i) => i.type === "tool")
      .map((i) => i.id);

    const deviceIds = selectedItems
      .filter((i) => i.type === "device")
      .map((i) => i.id);

    const payload = {
      name,
      type: docType,
      comment,
      objectId,
      // Гарантируем, что это массивы, даже если они пустые
      toolIds: Array.isArray(toolIds) ? toolIds : [],
      deviceIds: Array.isArray(deviceIds) ? deviceIds : [],
      file: file || undefined,
    };

    if (editingDoc) {
      await updateMutation.mutateAsync({
        id: editingDoc.id,
        data: payload, // Если хуки типизированы строго, лучше создать интерфейс для Payload
      });
    } else {
      await createMutation.mutateAsync(payload);
    }

    setOpen(false);
    resetForm();
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter((d) => {
      // 3. Упрощаем условие (теперь всегда фильтруем по типу)
      const matchesType = d.type === filterType;

      const s = documentSearchQuery.toLowerCase();
      const matchesSearch =
        !documentSearchQuery ||
        d.name.toLowerCase().includes(s) ||
        d.tools.some((t) => t.name.toLowerCase().includes(s)) ||
        d.tools.some((t) => t.serialNumber?.toLowerCase().includes(s)) ||
        d.devices.some((t) => t.serialNumber?.toLowerCase().includes(s)) ||
        d.devices.some((dev) => dev.name.toLowerCase().includes(s));
      return matchesType && matchesSearch;
    });
  }, [documents, filterType, documentSearchQuery]);

  console.log(documents);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="text-lg">Документы</CardTitle>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isDocsLoading ? "Загрузка..." : `${documents.length} всего`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по инвентарю..."
              value={documentSearchQuery}
              onChange={(e) => setDocumentSearchQuery(e.target.value)}
              className="pl-9 w-[200px] h-9"
            />
          </div>

          <Dialog
            open={open}
            onOpenChange={(v) => {
              setOpen(v);
              if (!v) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" /> Добавить
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0 overflow-auto">
              <DialogHeader className="p-6 pb-0">
                <DialogTitle>
                  {editingDoc ? "Редактировать" : "Новый документ"}
                </DialogTitle>
              </DialogHeader>

              <ScrollArea className="flex-1 px-6">
                <div className="space-y-5 py-4">
                  {!editingDoc &&
                    (file ? (
                      <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="flex-1 text-sm truncate">
                          <DescriptionPopover text={file.name} maxLength={15} />
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setFile(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <DocumentDropZone onFileSelect={setFile} />
                    ))}

                  <div className="space-y-2">
                    <Label>Название</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Напр: Акт ввоза инструментов"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Тип документа</Label>
                    <Select
                      value={docType}
                      onValueChange={(v) => setDocType(v as ObjectDocType)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(DOC_TYPE_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            <span className="flex items-center gap-2">
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  label === "Ввоз"
                                    ? "bg-emerald-500"
                                    : label === "Вывоз"
                                      ? "bg-rose-500"
                                      : label === "Внос"
                                        ? "bg-sky-500"
                                        : "bg-amber-500"
                                }`}
                              />

                              {label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Заметка</Label>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Инвентарь</Label>
                    <div className="flex gap-2">
                      <Select
                        value={inventoryType}
                        onValueChange={(v: "tool" | "device") =>
                          setInventoryType(v)
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tool">Инструмент</SelectItem>
                          <SelectItem value="device">Быт. инв.</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Поиск..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    {searchQuery && itemsList.length > 0 && (
                      <div className="border rounded-lg max-h-32 overflow-y-auto">
                        {itemsList.map((item: any) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              const exists = selectedItems.find(
                                (i) => i.id === item.id,
                              );
                              setSelectedItems(
                                exists
                                  ? selectedItems.filter(
                                      (i) => i.id !== item.id,
                                    )
                                  : [...selectedItems, item],
                              );
                            }}
                            className="flex items-center justify-between p-2 hover:bg-muted cursor-pointer text-sm"
                          >
                            <span className="flex gap-2">
                              {item.name}
                              <span className="text-muted-foreground">
                                {item.serialNumber}
                              </span>
                            </span>
                            {selectedItems.some((i) => i.id === item.id) && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {selectedItems.map((item) => (
                        <Badge
                          key={item.id}
                          variant="secondary"
                          className="gap-1"
                        >
                          {item.name}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() =>
                              setSelectedItems((prev) =>
                                prev.filter((i) => i.id !== item.id),
                              )
                            }
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <DialogFooter className="p-6 border-t">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Отмена
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={
                    !name.trim() ||
                    createMutation.isPending ||
                    updateMutation.isPending
                  }
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingDoc ? "Сохранить" : "Создать"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <div className="border-b bg-muted/20 px-4">
        <Tabs value={filterType} onValueChange={(v) => setFilterType(v as any)}>
          <TabsList className="h-auto bg-transparent p-0 gap-0">
            {/* 4. Удалили ручной TabsTrigger для "Все" */}
            {Object.entries(DOC_TYPE_LABELS).map(([key, label]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <CardContent className="p-4">
        {isDocsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredDocuments.length === 0 ? (
          <Empty className="py-12 border-2 border-dashed">
            <EmptyHeader>
              <EmptyTitle>Документы не найдены</EmptyTitle>
              <EmptyDescription>
                Попробуйте сбросить фильтры или добавить новый документ
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid gap-3">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                onEdit={handleEdit}
                onDelete={setDeleteId}
              />
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить документ?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (deleteId) {
                  await deleteMutation.mutateAsync(deleteId);
                  setDeleteId(null);
                }
              }}
              disabled={deleteMutation.isPending}
            >
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
