import { useState } from "react";
import { MessageSquare, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { useDocumentComment } from "@/hooks/employee/useEmployeeDocumentComment";
import type { EmployeeDocument } from "@/types/employee";

interface Props {
  doc: EmployeeDocument;
  employeeId: string;
}

export function DocumentCommentActions({ doc, employeeId }: Props) {
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [confirmDeleteComment, setConfirmDeleteComment] = useState(false);
  const [tempComment, setTempComment] = useState(doc.comment || "");

  const { updateComment, deleteComment, isUpdating } =
    useDocumentComment(employeeId);

  return (
    <>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <MessageSquare className="mr-4 h-4 w-4" /> Комментарий
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault(); // <--- Останавливаем закрытие меню
                setTempComment(doc.comment || "");
                setCommentDialogOpen(true);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              {doc.comment ? "Изменить" : "Добавить"}
            </DropdownMenuItem>

            {doc.comment && (
              <DropdownMenuItem
                className="text-destructive"
                onSelect={(e) => {
                  e.preventDefault(); // <--- Останавливаем закрытие меню
                  setConfirmDeleteComment(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Удалить
              </DropdownMenuItem>
            )}
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>

      {/* Диалоги вынесены за пределы DropdownMenuSubContent, 
          но благодаря preventDefault они теперь открываются стабильно */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        {/* ... содержимое без изменений ... */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Комментарий к документу</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <Label>Текст заметки</Label>
            <Textarea
              value={tempComment}
              onChange={(e) => setTempComment(e.target.value)}
              className="min-h-[120px]"
              placeholder="Введите текст..."
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCommentDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button
              disabled={isUpdating}
              onClick={() => {
                updateComment({ documentId: doc.id, comment: tempComment });
                setCommentDialogOpen(false);
              }}
            >
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmDeleteComment}
        onOpenChange={setConfirmDeleteComment}
      >
        {/* ... содержимое без изменений ... */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить этот комментарий?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteComment(false)}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteComment(doc.id);
                setConfirmDeleteComment(false);
              }}
            >
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
