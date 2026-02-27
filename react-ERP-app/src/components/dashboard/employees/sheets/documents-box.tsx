import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, FileText, X } from "lucide-react";

import { useEmployeeDocuments } from "@/hooks/employee/useEmployeeDocuments";
import { useUploadEmployeeDocument } from "@/hooks/employee/useUploadEmployeeDocument";
import { useRemoveEmployeeDocument } from "@/hooks/employee/useRemoveEmployeeDocument";
import { useUpdateEmployeeDocument } from "@/hooks/employee/useUpdateEmployeeDocument";
import { EmployeeHintForDoc } from "./employee-hint-for-doc";

import type { Employee, EmployeeDocument } from "@/types/employee";
import { DocumentDropZone } from "./document/document-drop-zone";
import { DocumentItem } from "./document/document-item";

export function EmployeeDocumentsBox({ employee }: { employee: Employee }) {
  const [open, setOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<EmployeeDocument | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [expDate, setExpDate] = useState<string | undefined>();
  const [isIndefinite, setIsIndefinite] = useState(false);
  const [comment, setComment] = useState("");

  const { data: documents = [], isLoading } = useEmployeeDocuments(employee.id);
  const { mutate: upload } = useUploadEmployeeDocument(employee.id);
  const { mutate: remove } = useRemoveEmployeeDocument(employee.id);
  const { mutate: update } = useUpdateEmployeeDocument(employee.id);

  const reset = () => {
    setFile(null);
    setName("");
    setExpDate(undefined);
    setIsIndefinite(false);
    setComment("");
    setEditingDoc(null);
  };

  const handleEdit = (doc: EmployeeDocument) => {
    setEditingDoc(doc);
    setName(doc.name);
    setExpDate(doc.expDate || undefined);
    setIsIndefinite(doc.isIndefinite);
    setComment(doc.comment || "");
    setOpen(true);
  };
  const onSave = () => {
    const payload = {
      name,
      expDate: isIndefinite ? null : expDate,
      isIndefinite,
      comment: comment.trim() || undefined,
    };

    // Используем if/else вместо тернарного оператора
    if (editingDoc) {
      update({ documentId: editingDoc.id, data: payload });
    } else {
      upload({ file: file!, data: payload });
    }

    setOpen(false);
    reset();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle>Документы</CardTitle>
          <EmployeeHintForDoc />
        </div>
        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) reset();
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Добавить
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="flex items-center justify-start flex-row">
              <DialogTitle>
                {editingDoc ? "Редактировать" : "Новый документ"}
              </DialogTitle>
              <EmployeeHintForDoc />
            </DialogHeader>
            <div className="space-y-4 py-2">
              {!editingDoc &&
                (file ? (
                  <div className="flex items-center gap-2 border p-2 rounded-lg bg-muted/50 text-sm">
                    <FileText className="h-4 w-4 text-primary" />{" "}
                    <span className="flex-1 truncate">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setFile(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <DocumentDropZone
                    onFileSelect={setFile}
                    isDragging={false}
                    setIsDragging={() => {}}
                  />
                ))}
              <div className="space-y-1">
                <Label>Название</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="p-3 border rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="ind"
                    checked={isIndefinite}
                    onCheckedChange={(v) => setIsIndefinite(!!v)}
                  />
                  <Label htmlFor="ind">Бессрочно</Label>
                </div>
                {!isIndefinite && (
                  <DatePicker selected={expDate} onSelect={setExpDate} />
                )}
              </div>
              <div className="space-y-1">
                <Label>Заметка</Label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={onSave}
                disabled={!name || (!file && !editingDoc)}
              >
                Сохранить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          <p className="text-center py-4 text-sm">Загрузка...</p>
        ) : documents.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
            Список пуст
          </p>
        ) : (
          documents.map((doc) => (
            <DocumentItem
              key={doc.id}
              doc={doc}
              employeeId={employee.id}
              onDelete={setDeleteId}
              onEdit={handleEdit}
            />
          ))
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
              onClick={() => {
                remove(deleteId!);
                setDeleteId(null);
              }}
            >
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
