import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteShiftTemplate } from "@/hooks/shift-template/useShiftTemplate";

interface Props {
  templateId: string;
  templateName: string;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onDeleted?: () => void;
}

export function ShiftTemplateDeleteDialog({
  templateId,
  templateName,
  open,
  onOpenChange,
  onDeleted,
}: Props) {
  const deleteMutation = useDeleteShiftTemplate(templateId);

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        onOpenChange(false);
        onDeleted?.();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Удалить шаблон?</DialogTitle>
        </DialogHeader>

        <p className="text-muted-foreground">
          Вы уверены, что хотите удалить&nbsp;
          <span className="font-medium text-foreground">“{templateName}”</span>?
          Это действие нельзя отменить.
        </p>

        <DialogFooter className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            Удалить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
