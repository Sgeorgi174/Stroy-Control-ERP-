import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Tool } from "@/types/tool";
import { useAddToolComment } from "@/hooks/tool/useAddToolComment";
import { useUpdateToolComment } from "@/hooks/tool/useUpdateToolComment";
import { useDeleteToolComment } from "@/hooks/tool/useDeleteToolComment";
import type { AddToolCommentDto } from "@/types/dto/tool.dto";

type ToolCommentDialogProps = {
  type: "add" | "edit" | "delete" | null;
  onClose: () => void;
  tool: Tool;
};

export function ToolCommentDialog({
  type,
  onClose,
  tool,
}: ToolCommentDialogProps) {
  const [comment, setComment] = useState(tool.comment || "");

  const addMutation = useAddToolComment(tool.id);
  const updateMutation = useUpdateToolComment(tool.id);
  const deleteMutation = useDeleteToolComment(tool.id);

  // Сброс поля при смене типа или закрытии
  useEffect(() => {
    if (type === "edit") setComment(tool.comment || "");
    if (type === "add") setComment("");
  }, [type, tool.comment]);

  if (!type) return null;

  const titleMap = {
    add: "Добавить комментарий",
    edit: "Редактировать комментарий",
    delete: "Удалить комментарий",
  };

  const isLoading =
    addMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const handleConfirm = async () => {
    const data: AddToolCommentDto = { comment };

    if (type === "add") {
      await addMutation.mutateAsync(data);
    } else if (type === "edit") {
      await updateMutation.mutateAsync(data);
    } else if (type === "delete") {
      await deleteMutation.mutateAsync();
    }

    onClose();
  };

  return (
    <Dialog open={!!type} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{titleMap[type]}</DialogTitle>
        </DialogHeader>

        {type !== "delete" ? (
          <Textarea
            placeholder="Введите комментарий..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[150px]"
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            Вы действительно хотите удалить комментарий для инструмента{" "}
            <span className="font-medium">{tool.name}</span>?
          </p>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button
            variant={type === "delete" ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isLoading || (type !== "delete" && !comment.trim())}
          >
            {type === "delete" ? "Удалить" : "Сохранить"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
